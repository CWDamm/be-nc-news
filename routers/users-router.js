const usersRouter = require('express').Router();

const { getUsers, getUserById } = require('../controllers/users-controllers.js');

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUserById);

module.exports = usersRouter;