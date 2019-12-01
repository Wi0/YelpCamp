const 	express = require("express"),
		app = express(), 
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
	  	passport = require("passport"),
	  	LocalStrategy = require("passport-local"),
	  	methodOverride = require("method-override"),
	  	passportLocalMongoose = require("passport-local-mongoose"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment"),
		User = require("./models/user"),
		seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");


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
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));

//Delete all campgrounds and comments
// seedDB();    

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "The wind blows west to east",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});