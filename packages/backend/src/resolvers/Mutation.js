const Mutation = {
  async createItem(parent, args, context, info) {
    // TODO: Checked if logged in
    const item = await context.db.mutation.createItem(
      {
        data: { ...args },
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
};

module.exports = Mutation;
