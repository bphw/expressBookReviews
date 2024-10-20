const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   Task1
//   return res.status(300).json({message: "Yet to be implemented"});
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

  if(books[isbn]) {
    return res.send(JSON.stringify(books[isbn]));
  } else {
    return res.status(404).json({message: `No book found with ISBN ${isbn}`});
    
  } 
  
//   return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Task3
  const author = req.params.author;
  let matchAuthor = [];

  for(let key in books) {
    if (books[key].author === author) matchAuthor.push(books[key]);
  }
  if(matchAuthor.length > 0) {
    return res.status(200).json(matchAuthor);
  }
  return res.status(300).json({message: "Yet to be implemented"});
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
  if(matchTitle.length > 0) {
    return res.status(200).json(matchTitle);
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // Task5
  const isbn = req.params.isbn;

  if(books[isbn]) {
    return res.send(JSON.stringify(books[isbn].review));
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
