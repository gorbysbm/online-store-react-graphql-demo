const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');
const jwt = require('jsonwebtoken');

const server = createServer();
server.express.use(cookieParser());

// decode the JWT so we can get the user Id on each request
server.express.use(async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId on to the request for future requests for access
    req.userId = userId;
  }

  if (!req.userId) return next();
  const user = await db.query.user({ where: { id: req.userId } }, '{id, permissions, email, name}');
  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => console.log(`server is running on http://localhost:${deets.port}`)
);
