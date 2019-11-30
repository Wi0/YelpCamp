const 	express = require("express"),
		app = express(), 
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment"),
		// Users = require("./models/users");
		seedDB = require("./seeds");


mongoose.connect("mongodb+srv://Duncan:nHpkOWGGStso@webdev-cljuh.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("connected to DB");
}).catch(err => {
	console.log("error, err.message");
})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();    

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
	var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
	
    //Create new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
    		res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//========================================
// Comment routes
// =======================================

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
	if(err){
		console.log(err);
	} else {
			res.render("comments/new", {campground: campground} );
	}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
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

app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});