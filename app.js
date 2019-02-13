var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	Campground	= require("./models/campground"),
	Comment		= require("./models/comment"),
	User		= require("./models/user"),
	seedDB		= require("./seeds")

// requiring routes 
var commentRoutes		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index")
	
var port = process.env.port || 3000;

// console.log(process.env.DATABASEURL);
// The database made it automatically
// mongoose.connect("mongodb://localhost/yelp_camp_v12",  { useNewUrlParser: true });
// mongoose.connect("mongodb://yelpcamp_user:password3@ds251827.mlab.com:51827/yelpcamp_zor");

mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();//seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"Life is good!",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is a middleware, that will run in every single route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(port, process.env.IP,function(){
	// console.log(process.env.IP);
	// console.log(process.env.PORT);
	console.log("The YelpCamp Server Has Started!");
});
