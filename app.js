var 
//NPM PACKAGES
    express               = require("express"),    
    mongoose              = require("mongoose"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	flash                 = require("connect-flash"),
	localStrategy         = require("passport-local"),
	methodOverride        = require("method-override"),
	passportLocalMongoose = require("passport-local-mongoose"),
//MODELS
    User                  = require("./models/user"),
	Comment               = require("./models/comment"),
    Campground            = require("./models/campground"),
//ROUTES
	indexRoutes           = require("./routes/index"),
	commentRoutes         = require("./routes/comments"),
	campgroundRoutes      = require("./routes/campgrounds");
//MORE VAR
	app                   = express(),
    port                  = process.env.PORT || 3000,

// ========================================================================	//
// ========================================================================	//

//MONGOOSE CONFIGURATION
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var mongooseConnect = mongoose.connect(process.env.DATABASEURL);
mongooseConnect.then(() => {
	console.log("Connected to DB!");
}).catch(err =>	{
	console.log("ERROR:", err.message);
}); 

//GENERAL
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

//SEED THE DATABASE
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Chandre is the best",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//VARIABLE PASS
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
});
app.locals.moment          = require("moment"),

//ROUTES CONNECT
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//SERVER LISTENER
app.listen(port, function(){
	console.log("The Yelpcamp Server has started");
});
	
	
	
	
	