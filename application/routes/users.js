//Import needed modules
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const UserError = require('../helpers/error/UserError');
const db = require('../conf/database');

//Create a new account for the user
router.post("/register", function (req, res, next) {
  //Get inputed data
  const { username, email, password } = req.body;
  //Validate username
  db.query('select id from users where username=?', [username])
    .then(function ([results, fields]) {
      //If username is free, then check email
      if (results && results.length == 0) {
        return db.query('select id from users where email=?', [email]);
        //Tell user their username is taken
      } else {
        throw new UserError('Error: Username already taken!', "/register", 200);
      }
      //If email is free, then encrypt password to send to database
    }).then(function ([results, fields]) {
      if (results && results.length == 0) {
        //Encrypt with level 2 security
        return bcrypt.hash(password, 2);
        //Tell user email is taken
      } else {
        throw new UserError('Error: Email already taken!', "/register", 200);
      }
      //Insert all user data into database
    }).then(function (hashPwd) {
      return db.execute('insert into users (username, email, password) ' +
        'value (?,?,?)', [username, email, hashPwd])
    })
    .then(function ([results, fields]) {
      //If successful, redirect to login
      if (results && results.affectedRows == 1) {
        res.redirect('/login');
        //Tell user there is an error (if exists)
      } else {
        throw new UserError('Error: User could not be made', "/register", 200);
      }
    })
    //Catch error and use helper errors
    .catch(function (err) {
      if (err instanceof UserError) {
        req.flash("error", err.getMessage());
        req.session.save(function (saveErr) {
          res.redirect(err.getRedirectURL());
        })
      } else {
        next(err);
      }
    });
});

//Attempt to login user
router.post("/login", function (req, res, next) {
  //Get inputed data
  const { username, password } = req.body;
  let loggedUserId;
  let loggedUsername;

  //Check if user exists in database
  db.query('select id, username, password from users where username=?', [username])
    .then(function ([results, fields]) {
      //If results, then user exists
      if (results && results.length == 1) {
        //Assign data to variables
        loggedUserId = results[0].id;
        loggedUsername = results[0].username;
        let dbPwd = results[0].password;
        return bcrypt.compare(password, dbPwd);
        //Tell user their credentials did not match database
      } else {
        throw new UserError('Failed Login: Invalid login credentials', "/login", 200);
      }
    }).then(function (pwdsMatched) {
      //Login user via sessions if successful
      if (pwdsMatched) {
        req.session.userId = loggedUserId;
        req.session.username = loggedUsername;
        req.flash("success", `Hi ${loggedUsername}, you are now logged in.`);
        req.session.save(function (saveError) {
          res.redirect('/');
        })
        //Tell user their login credentials do not match database
      } else {
        throw new UserError('Failed Login: Invalid login credentials', "/login", 200);
      }
    })
    //Catch error using helpers
    .catch(function (err) {
      if (err instanceof UserError) {
        req.flash("error", err.getMessage());
        req.session.save(function (saveErr) {
          res.redirect(err.getRedirectURL());
        })
      } else {
        next(err);
      }
    });
});

//To logout, destroy session
router.post("/logout", function (req, res, next) {
  req.session.destroy(function (destroyErr) {
    if (destroyErr) {
      next(err);
    } else {
      res.json({
        status: 200,
        message: "You have been logged out"
      });
    }
  })
});

module.exports = router;
