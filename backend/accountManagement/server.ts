const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.ts');

const config = require('./config');
const app = express();
const port = 3003;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
