const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const authenticatedUser = require('./auth_users.js').authenticatedUser;
const jwt = require('jsonwebtoken');

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({message: "Invalid Credentials"});  
  }
  if (isValid(username)) {
    try {
      users.push({username,password});
    } 
    catch (err) {
      return res.status(500).json({message: "Cant register user"});
    }
  } 
  else {
    return res.status(404).json({message: "User already exists"});
  }
  return res.status(200).json({message: "User registered"});
});


//only registered users can login
public_users.post("/user", (req,res, next) => {
  const {username, password} = req.body;
  if(authenticatedUser(username,password)){
    const accessToken = jwt.sign({username: username}, "access_token_secret", {expiresIn: "20m"});
    req.session.auth = {accessToken, username};
    return res.status(200).json({message: "Logged In", accessToken: accessToken});
  }
  return res.status(401).json({message: "Invalid username/password"});
});



// Get the book list available in the shop
public_users.get('/', function async (req, res) {
  if (Object.keys(books).length === 0) {
    return res.status(404).json({message: "No books available"});
  }
  return res.status(200).json({books: books});
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({message: "No book exists with the given ISBN"});
  }
  return res.status(200).json(books[isbn]);
 });
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const book_author = [];
  try {
    for (let book in books) {
      if(books[book].author === author) {
        book_author.push(books[book]);
      }
    }
  }
  catch (err) {
    return res.status(500).json({message: "Error occured while fetching books list"});
  }

  if (book_author.length === 0) {
    return res.status(404).json({message: "No book exists with the given author"});
  }
  return res.status(200).json(book_author);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const book_title = [];
  try {
    for (let book in books) {
      if(books[book].title === title) {
        book_title.push(books[book]);
      }
    }
  }
  catch (err) {
    return res.status(500).json({message: "Error occured while fetching books list"});
  }
  
  if (book_title.length === 0) {
    return res.status(404).json({message: "No book exists with the given author"});
  }
  return res.status(200).json(book_title);
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({message: "No book exists with the given ISBN"});
  }
  if (!!books[isbn].review) {
    return res.status(404).json({message: "No review for the given book"});
  }
  return res.status(200).json({review: books[isbn].review});
});

module.exports.general = public_users;
