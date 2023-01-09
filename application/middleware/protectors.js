//Route protector module
module.exports = {
    //Check to see if a current user is logged in
    isLoggedIn: function(req, res, next) {
        if(req.session.username){
            next();
        }else{
            //Block posting function to users not logged in
            req.flash("error", "You must be logged in to post.");
            req.session.save(function(saveError){
                res.redirect('/login');
            });
        }
    }
}