var express = require('express');
var router = express.Router();
// const { uuid } = require("uuidv4")

const userList = []

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'hello' });
});

router.post("/create-user", function (req, res, next) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const id = uuid();

  const newUser = {
    id,
    firstName,
    lastName,
    email,
  };
  userList.push(newUser);
  res.status(200).json(userList);
});

module.exports = router;
