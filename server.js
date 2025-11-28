const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

let corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:8081",
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
  initial();
}).catch(err => {
  console.log('Failed to sync db: ' + err.message);
});

app.get("/", (req, res) => {
  res.json({ 
    message: "JWT Auth API is running!",
    environment: process.env.NODE_ENV || 'development'
  });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.findOrCreate({
    where: { id: 1 },
    defaults: { name: "user" }
  });
  Role.findOrCreate({
    where: { id: 2 },
    defaults: { name: "admin" }
  });
}