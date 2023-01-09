//Import needed modules
const express = require('express');
const router = express.Router();
const db = require('../conf/database');
//Create a new comment router
router.post("/create", function(req, res, next){
    //If user is not logged in block the comment
    if(!req.session.userId){
        res.json({
            status: "error",
            message: "You must be logged in to comment"
        })
    }else{
        //Create variables with post/comment and user data
        let {comment, postId} = req.body;
        let {userId, username} = req.session;
        //Insert comment into database
        db.execute(`INSERT INTO comments (text, fk_authorId, fk_postId) VALUE (?,?,?);`,
        [comment, userId, postId])
        .then(function([results, fields]){
            //Tell user if comment was submitted or not
            if(results && results.affectedRows === 1){
                res.json({
                    status: "success",
                    message: "Success!",
                    data: {
                        comment: comment,
                        username: username,
                        commentId: results.insertId
                    }
                })
            }else{
                res.json({
                    status: "error",
                    message: "Comment could not be created :("
                })
            }
        })
    }
})

module.exports = router