const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys');

mongoose.connect(MONGOURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on('connected', () => {
  console.log('CONNECTED TO DATABASE');
});
mongoose.connection.on('error', (err) => {
  console.log('err connecting ....', err);
});

require('./models/user');

//routes ....
app.use(express.json());
app.use(require('./routes/auth'));

app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
