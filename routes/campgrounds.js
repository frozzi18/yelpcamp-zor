var express =  require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req,res){
	// console.log(req.user)

	// Get all campgrounds from DB
	Campground.find({}, function(err,allCampground){
			if(err){
				console.log(err);
			} else {
				// console.log(a);
				res.render("campgrounds/index", {campgrounds:allCampground, currentUser: req.user});
			}
		}
	)
});

//CREATE- add new campground to DB
router.post("/",middleware.isLoggedIn, function(req,res){
	// res.send("YOU HIT THE POST ROUTE"); //For checking
	//get data from from add and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id:req.user._id,
		username:req.user.username
	};
	var newCampground = {name:name,price:price, image:image, description:desc, author:author};

	// Create a new campground and save to DB
	Campground.create(newCampground, function(err,newCampgroundAdded){
			if(err){
				console.log(err);
			} else {
				// console.log("Successfully add new campground");
				console.log(newCampgroundAdded);

				// redirect back to campgrounds page
				res.redirect("/campgrounds");
			}
		}
	)	

});

// CREATE - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});

//This line must be after other get routes, order is important
// SHOW - shows more info about one campground
router.get("/:id", function(req,res){
	// Find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			// console.log(err);
			req.flash("error", "campground not found");
			res.redirect("/back");
		} else {
			// console.log(foundCampground);
			// render show template with that campground
			res.render("campgrounds/show", {campground:foundCampground});
		}
	});
	// res.send("this will be the show page one day")
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground:foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
	// res.send("you are trying to delete something!!")
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
})

//middleware
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// };

// function checkCampgroundOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id, function(err, foundCampground){
// 			if(err){
// 				res.redirect("back")
// 			} else {
// 				//does user own the campground?
// 				// console.log(foundCampground.author.id); // this is mongoose object
// 				// console.log(req.user._id); //this is string, don't use === but use equals()

// 				if(foundCampground.author.id.equals(req.user._id)){
// 					next();
// 				} else {
// 					res.redirect("back");
// 				}
				
// 			}
// 		});
// 	} else {
// 		// console.log("YOU NEED TO BE LOGGED IN TO DO THAT!!!");
// 		// res.send("YOU NEED TO BE LOGGED IN TO DO THAT!!!");

// 		res.redirect("back");

// 	}
// }

module.exports = router;