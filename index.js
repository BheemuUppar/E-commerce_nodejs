const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/routes/route.js'); // Import the routes
const environment = require('./config/environment');
const path = require('path');

const htmlPaths = path.dirname(__dirname);

// run express
const app = express();
// middlewares
app.use(cors());
// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url =
  'mongodb+srv://bheemuk123:73vA689BIc1gppmf@cluster0.yrpks57.mongodb.net/E-commerce?retryWrites=true&w=majority';
// Connect to MongoDB Atlas
mongoose
  .connect(environment.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Use the routes from routes.js
app.use('/', routes);

app.get("**" , (req ,res)=>{
   res.send("<h1>404 not found<h1>");
   res.end()
})

const PORT = environment.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
