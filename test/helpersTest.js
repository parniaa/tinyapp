const { assert, use } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user object with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = testUsers["userRandomID"];
    // Write your assert statement here
    assert.strictEqual(user, expectedOutput);
  });
  it('should return undefined  with invalid email', function() {
    const user = getUserByEmail("users212222@example.com", testUsers);
    // Write your assert statement here
    assert.strictEqual(user, undefined);
  });
});
