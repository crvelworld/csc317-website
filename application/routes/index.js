//Import needed modules
var express = require('express');
const {isLoggedIn} = require('../middleware/protectors');
const {getRecentPosts, getPostById, getCommentById} = require('../middleware/posts');
var router = express.Router();

//Get home page and recent posts
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index');
});
//Get login page
router.get("/login", function (req, res) {
  res.render('login');
});
//Get register page and js
router.get("/register", function (req, res) {
  res.render('registration', {js: ['register']});
});
//Get post page and check if user is logged in
router.get("/post", isLoggedIn, function (req, res) {
  res.render('postimage');
});
//Get single post page by id and its comments and js
router.get("/posts/:id(\\d+)", getPostById, getCommentById, function (req, res) {
  res.render('viewimage', {js: ['viewpost']});
});

module.exports = router;
