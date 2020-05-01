var express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campground"),
	middleware = require("../middleware");



// INDEX - Displays campgrounds.
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
		}
	});	
});

// NEW - Displays form to make a new campground.
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//CREATE - Add new campgrounds to DB.
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
	var name          = req.body.name,
		price         = req.body.price, 
	    image         = req.body.image,
	    desc          = req.body.description,
		author        = { id: req.user._id, username: req.user.username },
	    newCampground = { name: name, price: price, image: image, description: desc , author: author};
	//Create new campground and save to DB
	Campground.create(newCampground, function(err, add) {
		if(err){
			req.flash("error", err.message);
		} else {
			req.flash("success", "Campground successfully created.")
			res.redirect("/campgrounds");
		}
	});
});

// SHOW - Show info about selected campground
router.get("/:id", function(req, res){
	// find campground with provided id 
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found")
			res.redirect("back")
		} else {
			// render show template with that campground
			res.render("campgrounds/show", {campgrounds: foundCampground})
		}
	});
});

// EDIT - Show edit form for a campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});		
	});		 
});

//UPDATE - Update campsite, then redirect.
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}	
	});	
});

//DESTROY - Delete a campground, then redirect.
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Campground deleted")
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;