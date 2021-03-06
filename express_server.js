//REQUIRES AND LIBRARY SETIUPS
const express = require("express");
const helpers = require("./helpers.js");
const app = express();
const PORT = 8080; // default port 8080
// const cookieParser = require('cookie-parser'); at the begining we used cookieparser
const cookieSession = require('cookie-session');

//bycrypt setup
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
//In the begining we Used cookie parse
// app.use(cookieParser());

//Using CookieSession
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);
//Internal DATABASE
const newUrlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3dowr: { longURL: "https://www.s.ca", userID: "aJ48lW" },
  i3Bcfr: { longURL: "https://www.d.ca", userID: "aJ48lW" },
  i2BoGr: { longURL: "https://www.gofogle.ca", userID: "aJ48lW" },
  i3BgGr: { longURL: "https://www.google.ca", userID: "ag48lW" }
};
const usersDB = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "aa@aa.aa",
    password: "aa"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

////Routing
//GET URLS
app.get("/", (req, res) => {
  if (req.session["id"]) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});
app.get("/urls", (req, res) => {
  let LoggedInUserID = req.session["id"];
  if (LoggedInUserID) {
    const userSpecificURLsObject = helpers.urlsForUser(LoggedInUserID,newUrlDatabase);
    const urlDatabase = helpers.urlsOnlyObject(userSpecificURLsObject);
    const templateVars = {
      urls: urlDatabase,

      userObject: usersDB[LoggedInUserID]
    };
    res.render("urls_index", templateVars);
  } else {
    res.send("Please login first");
  }
});

//(GET-REGISTER)User Registeration from
app.get("/register", (req, res) => {
  const templateVars = {
    userObject: usersDB[req.session["id"]]
  };
  res.render("register_index", templateVars);
});

//(POST-REGISTER)user registeration form
app.post("/register", (req, res) => {
  // If the e-mail or password are empty strings,
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.status(404).send(`Error 404! The email or password is blank`);
  }
  const user = helpers.getUserByEmail(email, usersDB);
  if (!user) {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const userInfo = {
      id: `USER${helpers.generateRandomString()}`,
      email: email,
      password: hashedPassword
    };
    //Adding the user to the database
    usersDB[userInfo.id] = userInfo;
    req.session.id = userInfo.id;
    res.redirect('/urls');
  } else {
    res.status(403).send(`Sorry, the email address is already registered`);
  }
});
//adding new urls
app.get("/urls/new", (req, res) => {
  if (req.session["id"]) {
    const templateVars = {
      userObject: usersDB[req.session["id"]]
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (req.session["id"]) {
    const urlDatabase = helpers.urlsOnlyObject(newUrlDatabase);
    const templateVars = {
      shortURL: req.params.shortURL ,
      longURL: urlDatabase[req.params.shortURL],
      userObject: usersDB[req.session["id"]] };
    res.render("urls_show", templateVars);
  } else {
    res.send("Please login first");
  }
});
//adding new LongURL and generate shortURL
app.post("/urls", (req, res) => {
  if (req.session["id"]) {
    const shortURL = helpers.generateRandomString();
    newUrlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session["id"]
    }
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.send("Please login first");
  }
});
///Redirects to urls the target destionation after submission
app.get("/u/:shortURL", (req, res) => {
  const urlDatabase = helpers.urlsOnlyObject(newUrlDatabase);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//Deleting selected URL(POST)
app.post('/urls/:shortURL/delete', (req, res) => {
  let LoggedInUserID = req.session["id"];
  if (LoggedInUserID) {
    const userSpecificURLsObject = helpers.urlsForUser(LoggedInUserID,newUrlDatabase);
    if (userSpecificURLsObject) {
      const urlToDelte = req.params.shortURL;
      delete newUrlDatabase[urlToDelte];
      res.redirect('/urls');
    }
  }
});
//updating a LongURK(POST)
app.post('/urls/:shortURL', (req, res) => {
  let LoggedInUserID = req.session["id"];
  if (LoggedInUserID) {
    const userSpecificURLsObject = helpers.urlsForUser(LoggedInUserID,newUrlDatabase);
    if (userSpecificURLsObject) {
      newUrlDatabase[req.params.shortURL] = {
        longURL: req.body.longURL,
        userID: LoggedInUserID
      };
      res.redirect('/urls');
    }
  }
});

// get username and  adding it to the cookie====>USER LOGIN FORM(GET)
app.get("/login", (req, res) => {
  const templateVars = {
    userObject: usersDB[req.session["id"]]
  };
  res.render("login_index", templateVars);
});
//USER LOGIN POST
app.post("/login", (req, res) => {
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;
  if (loginEmail === '' || loginPassword === '') {
    res.status(403).send(`Error 404! The email or password is blank`);
  }
  const user = helpers.getUserByEmail(loginEmail, usersDB);
  
  if (user) {
    const passwordIsValid = bcrypt.compareSync(loginPassword, user["password"]);
    if (passwordIsValid) {
      req.session.id = user["id"];
      res.redirect('/urls');
    } else {
      res.status(401).send('Wrong credentials(P)!, the email or password is not valid');
    }
  } else {
    res.status(401).send('Wrong credentials(U)!, the email or password is not valid');
  }
});
//navigate to logout
app.post('/logout', (req, res) => {
  req.session['id'] = null;
  res.redirect('/urls');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});