require('dotenv').config();
module.exports = {
  // url: 'mongodb+srv://root_TOF:TowerOfFantasy@cluster0.b3abiff.mongodb.net/?retryWrites=true&w=majority',

  url: process.env.URI,
};
