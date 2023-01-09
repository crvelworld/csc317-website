//Import needed modules
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const db = require('../conf/database');


//Code not mine! Imported from www.npmjs.com
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/uploads')
    },
    filename: function (req, file, cb) {
      let fileExt = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExt}`)
    }
  })
//Create variable to upload with new data
const upload = multer({ storage: storage })

//Accept user image and transform it
router.post('/create', upload.single("userImage"), function(req, res, next) {
  //Assign post data to variables
    let uploadedFile = req.file.path;
    let thumbnailName = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = `${req.file.destination}/${thumbnailName}`;
    const {title, description} = req.body;
    const userId = req.session.userId
    //Reduce size image for thumbnail
    sharp(uploadedFile).resize(200).toFile(destinationOfThumbnail)
    //Insert image into database with its user data
    .then(function(){
        let baseSQL = `
        INSERT INTO posts (title, description, image, thumbnail, fk_authorId) VALUE (?, ?, ?, ?, ?)`
       return db.query(baseSQL, [title, description, uploadedFile, destinationOfThumbnail, userId])
    })
    //Tell user the post was created
    .then(function([results, fields]){
        if(results && results.affectedRows){
            req.flash("success", "Your post has been created!");
            req.session.save(function(saveErr){
                res.redirect('/');
            })
        }
    })
    .catch(err => next(err));
})

//Search for a post given a keyword
router.get("/search", function(req, res, next){
  //Assign search data to variables
  let searchTerm = `%${req.query.searchTerm}%`;
  let originalSearchValue = req.query.searchTerm;
  //Get post from database using keywords
  let baseSQL = `SELECT id, title, description, thumbnail, CONCAT_WS(" ", title, description) 
  AS haystack
  FROM posts
  HAVING haystack LIKE ?;`;
  db.execute(baseSQL, [searchTerm])
  .then(function([results, fields]){
    //If no results redirect to home
    if(results.length == 0){
      req.flash("error", `0 results found!`);
      res.redirect('/');
    }
    //If results then show the posts and redirect to home
    res.locals.results = results;
    res.locals.searchValue = originalSearchValue;
    req.flash("success", `${results.length} results found!`);
    req.session.save(function(saveErr){
      res.render('index');
    })
  })
});

module.exports = router;