/*
Middleware to load post data
*/

//Create database connection (Not optimized)
const db = require('../conf/database');

module.exports = {
    //Get posts from database in descending order with a limit of 20
    getRecentPosts: function(req, res, next){
        db.query('SELECT id, title, description, thumbnail FROM posts ORDER BY createdAt DESC LIMIT 20')
        .then(function([results, fields]){
            if(results && results.length){
                //Create local variable with posts as an array
                res.locals.results = results;
            }
            next();
        })
        .catch(err => next(err));
    },
    //Get a specific post from database with its corresponding user data
    getPostById: function(req, res, next){
        let postId = req.params.id;
        let baseSQL = `SELECT p.id, p.title, p.description, p.image, p.createdAt, u.username
        FROM posts p
        JOIN users u
        ON p.fk_authorId=u.id
        WHERE p.id=?;`;
        db.query(baseSQL,[postId])
        .then(function([results, fields]){
            if(results && results.length == 1){
                //Create local variable with post and user data
                res.locals.currentPost = results[0];
            }
            next();
        })
    },
    //Get post comments from database with corresponding user data
    getCommentById: function(req, res, next){
        let postId = req.params.id;
        let baseSQL = `SELECT c.id, c.text, c.createdAt, u.username
        FROM comments c
        JOIN users u
        ON c.fk_authorId=u.id
        WHERE fk_postId=?;`
        db.execute(baseSQL, [postId])
        .then(function([results, fields]){
            //Create local variable with comment and user data
            res.locals.currentPost.comments = results;
            next();
        })
        .catch(err => next(err))
    }
};