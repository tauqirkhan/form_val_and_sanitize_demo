const { body, validationResult } = require("express-validator");
const usersStorage = require("../storages/usersStorage");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const ageErr = "must be between 18 to 120 years";
const emailErr = "must follow e-mail pattern";
const bioErr = "must not exceed 200 character";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("age")
    .trim()
    .isNumeric({ min: 18, max: 120 })
    .withMessage(`Age ${ageErr}`),
  body("email").trim().isEmail().withMessage().withMessage(`Email ${emailErr}`),
  body("bio").trim().isLength({ max: 200 }).withMessage(`Bio ${bioErr}`),
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

exports.usersSearchGet = (req, res) => {
  const { q } = req.query;
  const usersArr = usersStorage.getUsers();
  console.log(usersArr);
  const queryUserResult = usersArr.filter(
    (user) =>
      user.email.toLowerCase() === q.toLowerCase() ||
      user.firstName.toLowerCase() === q.toLowerCase() ||
      user.lastName.toLowerCase() === q.toLowerCase() ||
      user.firstName.toLowerCase() + user.lastName.toLowerCase() ===
        q.toLowerCase() ||
      `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}` ===
        q.toLowerCase()
  );
  res.render("search", {
    title: "Search list",
    users: queryUserResult,
  });
};
