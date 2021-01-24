
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


module.exports = {
  getUserByEmail,
  generateRandomString
};

