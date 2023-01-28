module.exports = (app) => {
  const router = require('express').Router();
  const User = require('../controllers/userController');

  router.post('/', User.createUser);
  router.get('/', User.findAllUsers);
  router.post('/find/:name&:tag', User.findOneUser);
  router.put('/vote', User.vote);
  app.use('/api/user', router);
};
