const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require(`../utils`);

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: Checked if logged in
    if (!ctx.request.userId) throw new Error(`You must be logged in t do that`);

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            // this is how to create a relationship between the item and the user
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // take copy of updates
    const updates = { ...args };
    // remove id from updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem(_, args, ctx, info) {
    const where = { id: args.id };
    // find item
    const item = await ctx.db.query.item({ where }, `{ id title user { id }}`);
    // check if they own item
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEMDELETE'].includes(permission)
    );
    if (!ownsItem && !hasPermissions) {
      throw new Error(`You don't have permission to do that`);
    }
    // delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signUp(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: {
            set: ['USER'],
          },
        },
      },
      info
    );
    // create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie. Starts at milliseconds
    });
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // check if user with email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for ${email}`);
    }
    //check if password correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid Password`);
    }
    // generate jwt token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set cookie with jwt token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie. Starts at milliseconds
    });
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },
  async requestReset(parent, args, ctx, info) {
    // check if real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) throw new Error(`No user found for the email: ${args.email}`);
    // set reset token and expiry on that user
    const randomBytesPromised = promisify(randomBytes);
    const resetToken = (await randomBytesPromised(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // one hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    // email them the reset token
    const mailRes = await transport.sendMail({
      from: 'tony@deadrobot.co.uk',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(`Your password reset link is here!
        \n\n
        <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click here to reset</a> `),
    });
    return { message: 'Thanks' };
  },
  async resetPassword(parent, args, ctx, info) {
    // check passwords match
    if (args.password !== args.confirmPassword) throw new Error(`Your passwords don't match`);
    // check legit token
    // check if expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    if (!user) throw new Error(`This token is either invalid or expired`);
    // hash password
    const password = await bcrypt.hash(args.password, 10);
    // save new password to db and remove reset token fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // set JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // return new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // check if logged in
    if (!ctx.request.userId) throw new Error(`Must be logged in`);
    // query current user
    const currentUser = await ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
    // check they have permissions to do this
    hasPermission(currentUser, [`ADMIN`, `PERMISSIONUPDATE`]);
    // update permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: { id: args.userId },
      },
      info
    );
  },
};

module.exports = Mutation;
