
//get user email and database and returns the user object associated with email
const getUserByEmail = function(email, database) {
  // loop through the usersDb object
  for (let userId in database) {
    // compare the emails, if they match return the user obj
    if (database[userId].email === email) {
      return database[userId];
    }
  }
};
const generateRandomString = function() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3dowr: { longURL: "https://www.s.ca", userID: "aJ48lW" },
  i3Bcfr: { longURL: "https://www.d.ca", userID: "aJ48lW" },
  i2BoGr: { longURL: "https://www.gofogle.ca", userID: "aJ48lW" },
  i3BgGr: { longURL: "https://www.google.ca", userID: "ag48lW" }
};

//returns the object of URLs where the userID is equal to the id of the currently logged-in user.
const urlsForUser = function(id) {
  let tempObject = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      
      tempObject[url] =  urlDatabase[url];

    }
  }
  return tempObject;
};
const urlsOnlyObject = function(usersUrls) {
  let tempObject = {};
  for (const urls in usersUrls) {
    tempObject[urls] = usersUrls[urls]["longURL"];
  }
  return tempObject;
};


// console.log(urlsOnlyObject(urlsForUser("aJ48lW")));
module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  urlsOnlyObject
};

