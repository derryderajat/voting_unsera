const { Schema } = require('mongoose');

module.exports = (mongoose) => {
  const User = mongoose.model(
    'User',
    mongoose.Schema({
      name: { type: String, required: true },
      tag: { type: String, required: true, unique: true },
      createdActivity: [{ roomKey: String }],
      voted: [{ roomKey: String }],
    })
  );
  return User;
};
