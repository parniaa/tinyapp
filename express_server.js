const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
var cookieParser = require('cookie-parser');

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});
//adding new LooongURL and using the generateRandomString function to generate shortURL
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});
//Redirecto to the target destionation after submission
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//Deleting a url user selected
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlToDelte = req.params.shortURL;
  delete urlDatabase[urlToDelte];
  res.redirect('/urls');
//updating a LongURK
});
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});
//adding a user to the cookie
app.post("/login", (req, res) => {
  res.cookie(`username`, req.body.userName);
  res.redirect('/urls');        // Respond with 'Ok' (we will replace this)
});

//Reading the cookie data
app.get('/urls', (req, res) => {
  // do something with the userId
  const templateVars = {
    username: req.cookies["username"]
  };
});
// res.render("urls_show", templateVars);

//Reading cookies
// app.get('/protected', (req, res) => {
//   const userId = req.cookies.userId;
//   // do something with the userId
// });

// const templateVars = {
//   username: req.cookies["username"]
// };

//Setting cookies
// app.post('/login', (req, res) => {
//   // other authenticatey stuff
//   res.cookie('userId', user.id); // set the cookie's key and value
//   res.redirect('/');
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = function() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
