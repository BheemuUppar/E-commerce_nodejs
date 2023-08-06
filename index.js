const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/routes/route.js'); // Import the routes
const environment = require('./config/environment');
const path = require('path');
const login = require('./src/routes/login.js');
const authMiddleware = require('./src/middlewares/middleware.js');

const htmlPaths = path.dirname(__dirname);
// run express
const app = express();
// middlewares
app.use(cors());
// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(authMiddleware);

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
app.use('/auth', login);


app.get("**" , (req ,res)=>{
   res.status(404).send("<h1>404 not found<h1>");
   res.end()
})

const PORT = environment.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
