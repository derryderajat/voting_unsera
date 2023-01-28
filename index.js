const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
mongoose.set('strictQuery', true);

const corsOptions = {
  // origin:"http://localhost"
};
// app.use(cors(corsOptions))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.json({ message: 'Voting App is working' });
});

const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

require('./api/user')(app);
require('./api/room')(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}...`);
});
