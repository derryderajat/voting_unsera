const { Schema } = require('mongoose');

module.exports = (mongoose) => {
  const Activity = mongoose.model(
    'Activity',
    mongoose.Schema({
      roomKey: { type: String, required: true },
      title: { type: String, required: true },
      options: [{ title: String, count: { type: Number, default: 0 } }],
      votedBy: [{ name: String, tag: String }],
    })
  );
  return Activity;
};
