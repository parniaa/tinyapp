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
//  res.cookie(`id`, userInfo.id) ===> req.session.user_id = "some value";
//  req.cookies["id"] ====> req.session.user_id
////=========================>DATABASESISHS<========================================
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const usersDB = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// ===============ROUTING==================>ROUTING<================ROUTING=====================

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
////////////////////////////////////GET URLS
app.get("/urls", (req, res) => {
  if (req.session["id"]) {
    const templateVars = {
      urls: urlDatabase,
      userObject: usersDB[req.session["id"]]
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
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
    res.status(403).send(`Error 404! The email or password is blank`);
  }
  const user = helpers.getUserByEmail(email, usersDB);
  if (!user) {
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const userInfo = {
      id: helpers.generateRandomString(),
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
///////////////////adding new urls
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
    const templateVars = {
      shortURL: req.params.shortURL ,
      longURL: urlDatabase[req.params.shortURL],
      userObject: usersDB[req.session["id"]] };
    res.render("urls_show", templateVars);
  } else {
    res.send("Please login first");
  }
});

//////////adding new LooongURL and using the generateRandomString function to generate shortURL
app.post("/urls", (req, res) => {
  let shortURL = helpers.generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

////////////////Redirec to urls the target destionation after submission
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
////////////////////////////Deleting selected URL(POST)
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlToDelte = req.params.shortURL;
  delete urlDatabase[urlToDelte];
  res.redirect('/urls');
//////////////////////////////////updating a LongURK(POST)
});
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

// get username and  adding it to the cookie====>USER LOGIN FORM(GET)
app.get("/login", (req, res) => {
  const templateVars = {
    userObject: usersDB[req.session["id"]]
  };
  res.render("login_index", templateVars);
});
//////////////////////USER LOGIN POST 
app.post("/login", (req, res) => {
  let loginEmail = req.body.loginEmail;
  let loginPassword = req.body.loginPassword;
  let flag = true;
  for (const key in usersDB) {
    console.log(bcrypt.compareSync(loginPassword, usersDB[key].password));
    if (usersDB[key].email === loginEmail && bcrypt.compareSync(loginPassword, usersDB[key].password)) {
      // res.cookie(`id`, usersDB[key].id); REPLACED WITH UNDER REQ.SESSION
      req.session.id = usersDB[key].id;
      res.redirect('/urls');
    } else {
      flag = false;
    }
  }
  if (!flag) {
    res.status(401).send('Wrong credentials!');
  }
});
////////////////////////navigate to logout
app.post('/logout', (req, res) => {
  req.session['id'] = null;
  res.redirect('/urls');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//////////////////////////Random GENERATOR



// <!-- <% if(userObject.email){ %>
//   <a class="nav-item nav-link">Wellcome! <%= userObject.email%></a>
//          <a class="nav-item nav-link" href="/login">login</a>
//          <a class="nav-item nav-link" href="/register">Register</a>
//        <% } else{ %>  
//          <form class="form-inline" action="/logout" method="POST">
//            <div class="form-group mb-2 ">
//              <a class="nav-item nav-link">Wellcome! <%= userObject.email%></a>
           
//            </div>
//            </form>
//       <% } %> -->