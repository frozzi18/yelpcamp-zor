var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){
					req.flash("error", "Campground not found");
                    res.redirect("back")
                } else {
                    //does user own the campground?
                    // console.log(foundCampground.author.id); // this is mongoose object
                    // console.log(req.user._id); //this is string, don't use === but use equals()
    
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    } else {
						req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                    
                }
            });
        } else {
            // console.log("YOU NEED TO BE LOGGED IN TO DO THAT!!!");
            // res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!!");
			req.flash("error", "You need to be logged in to do that");
            res.redirect("back");    
        }
    }

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back")
			} else {
				//does user own the comment?
				// console.log(foundCampground.author.id); // this is mongoose object
				// console.log(req.user._id); //this is string, don't use === but use equals()

				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
				
			}
		});
	} else {
		// console.log("YOU NEED TO BE LOGGED IN TO DO THAT!!!");
		// res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!!");
		req.flash("error", "You need to logged in to do that");
		res.redirect("back");

	}
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};


module.exports = middlewareObj;