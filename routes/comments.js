const express = require("express"),
	  router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// comments new
router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
	if(err){
		console.log(err);
	} else {
			res.render("comments/new", {campground: campground} );
	}
	});
});

//comments create
router.post("/", isLoggedIn, function(req, res){
	// Lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and ID to comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					
					campground.comments.push(comment);

					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	//create new comment
	
	//Connect new comment to campground
	
	//
});

//middleware
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;