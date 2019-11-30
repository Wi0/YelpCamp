const 	express = require("express"),
		app = express(), 
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		Campground = require("./models/campground"),
		// Comments = require("./models/comments"),
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
			res.render("index", {campgrounds:allCampgrounds});
		}
	});
    //res.render("campgrounds",{campgrounds:campgrounds});
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
   res.render("new.ejs"); 
});

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});