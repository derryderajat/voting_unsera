const db = require('../models');
const { generateTag } = require('../utils/TagGenerator.js');

const User = db.user;

// const mongoose = require('mongoose');

exports.findAllUsers = (req, res) => {
  User.find({})
    .select('name')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(404).send({
        message: err.message || 'User not found',
      });
    });
};
// Create new user
exports.createUser = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ message: 'username can not be empty!' });
  }

  const newUser = new User({
    name: req.body.name,
  });
  while (true) {
    if (!req.body.tag) {
      newUser.tag = req.body.tag;
    } else {
      newUser.tag = generateTag(4);
    }
    let isUserAvailable = await User.findOne({
      name: newUser.name,
      tag: newUser.tag,
    });
    // console.log(isUserAvailable, newUser.tag);
    if (isUserAvailable === null) {
      break;
    }
  }

  await User.create(newUser).then((data) => {
    res.status(201).send({ message: 'User added' });
  });
};
// Find one user
exports.findOneUser = async (req, res) => {
  // await console.log(req.params);
  const user = await User.findOne({
    name: req.params.name,
    tag: req.params.tag,
  });
  if (user) {
    res.status(200).send(user);
  }
  res.status(404).send({ message: 'not found' });
};

// Update one User
exports.vote = async (req, res) => {
  const filter = { name: req.body.name, tag: req.body.tag };
  if (!req.body.roomKey && !req.body.name && !req.body.tag) {
    res.status(402).send({ message: 'error updating' });
  }
  // Join room
  const update = await User.updateOne(filter, {
    $push: { voted: { roomKey: req.body.roomKey } },
  });
  if (update) {
    return res.status(201).send({ message: 'sucessfull updating' });
  }
  res.status(402).send({ message: 'error updating' });
};
