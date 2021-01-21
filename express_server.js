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
  // console.log("reqid", req.cookies["id"]);
  // console.log("userDB", usersDB);
 
  if (req.cookies["id"]) {
    let user = usersDB[req.cookies["id"]];
    // console.log("tttt" + req.cookies["id"]);
    
    const templateVars = {
      urls: urlDatabase,
      userObject: usersDB[req.cookies["id"]]
    };
    console.log("TTTTTTTT" , req.cookies);
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/register");
  }
});
// usersDB[req.cookies["id"]]
//(GET-REGISTER)User Registeration from
app.get("/register", (req, res) => {
  const templateVars = {
    userObject: usersDB[req.cookies["id"]]
  };
  res.render("register_index", templateVars);
});

//(POST-REGISTER)user registeration form
app.post("/register", (req, res) => {
  // If the e-mail or password are empty strings,
  if (req.body.email === '') {
    res.send("Error 404");
  }

  //if email exists! check the solution *******&&&&&&&
  // for (const key in usersDB) {
  //   if (key["email"] !== req.body.email) {
  //     console.log("wwwwwwwwwwrong email" + key["email"]);
  //     res.send("Error 400");
  //   }
  // }

  const userInfo = {
    id: generateRandomString(),
    email: req.body.email,
    password: req.body.password
  };
  usersDB[userInfo.id] = userInfo;
  res.cookie(`id`, userInfo.id);
  res.redirect('/urls');
});


//adding new urls
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
// get username and  adding it to the cookie


// Create a GET /login endpoint
app.get("/login", (req, res) => {
  const templateVars = {
    userObject: usersDB[req.cookies["id"]]
  };
  res.render("login_index", templateVars);
});

app.post("/login", (req, res) => {
  
  let loginEmail = req.body.loginEmail;
  let loginPassword = req.body.loginPassword;
  let flag = true;
  
  for (const key in usersDB) {
    console.log("sss" , loginEmail , loginPassword, key.email, key.password);
    if (usersDB[key].email === loginEmail && usersDB[key].password === loginPassword) {
     
      res.cookie(`id`, loginEmail);
      res.redirect('/urls');
    } else {
      flag = false;
    }
  }
  if (!flag) {
    res.send("Wrong password");
  }
});

//navigate to logout
app.post('/logout', (req, res) => {
  res.clearCookie(`id`);
  res.render('/urls');
});



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