const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task6
// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
//   Task6
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Username/password are not provided."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   Task1
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  // Task2
  const isbn = req.params.isbn;
  /* bellow if book has properties named 'isbn'
   * but since in this project isbn refer to object number, 
   * then simply use books[isbn]
   
  const arrayBooks = Object
    .keys(books)
    .map(key => books[key]);
  
  let book = arrayBooks.filter((item) => 
    item.hasOwnProperty('isbn') && item.isbn === isbn
  );
   */

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn]));
  } else {
    return res.status(404).json({message: `ISBN ${isbn} not found.`});
  } 
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Task3
  const author = req.params.author;
  let matchAuthor = [];

  for (let key in books) {
    if (books[key].author === author) matchAuthor.push(books[key]);
  }
  if (matchAuthor.length > 0) {
    return res.status(200).json(matchAuthor);
  } else {
    return res.status(404).json({message: `Author ${author} not found.`});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Task4
  const title = req.params.title;
  let matchTitle = [];

  for(let key in books) {
    if (books[key].title === title) matchTitle.push(books[key]);
  }
  if (matchTitle.length > 0) {
    return res.status(200).json(matchTitle);
  } else {
    return res.status(404).json({message: `Title ${title} not found.`});
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // Task5
  const isbn = req.params.isbn;

  if(books[isbn]) {
    return res.status(200).json(books[isbn].review);
  } else {
    return res.status(404).json({message: `ISBN ${isbn} not found.`});
  }
  
});

module.exports.general = public_users;
