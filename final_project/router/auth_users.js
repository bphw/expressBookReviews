const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return username !== undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Task7
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
    
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
//   Task7
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        
        return res.status(200).json({message:`User ${username} successfully logged in`});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
//   Task8
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let book = books[isbn];

    if (!book) return res.status(404).json({message: `ISBN ${isbn} not found.`});

    if (isValid(username)) {
        let author = req.body.author;
        let title = req.body.title;
        let userReview = req.body.review;

        if (author) book["author"] = author;
        if (title) book["title"] = title;
        // new username will add, existing username will replace old one
        book["reviews"][username] = {review:userReview};
        
        return res.status(200).json({message: `Reviews for ISBN ${isbn} added by ${req.session.authorization.username}.`,data:book});
    } else {
        return res.status(403).json({message: `Username is not logged in.`});
    }
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let book = books[isbn];

    if (!book) return res.status(404).json({message: `ISBN ${isbn} not found.`});

    if (isValid(username)) {
        // remove by username
        if (book.reviews.hasOwnProperty(username)) {
            delete book["reviews"][username];
            return res.status(200).json({message: `Remove review from ISBN ${isbn} commented by ${req.session.authorization.username}.`,data:book});
        }
        
    } else {
        return res.status(403).json({message: `Username is not logged in.`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
