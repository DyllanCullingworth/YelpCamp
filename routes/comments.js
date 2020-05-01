var express    = require("express"),
	router     = express.Router({mergeParams:true}),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	middleware = require("../middleware");


//NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	//look up campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			//create new comments
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "something went wrong..." + err.message)
					res.redirect("back");
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//push into comments array
					campground.comments.unshift(comment);
					campground.save();
					//redirect to campground show page
					req.flash("success", "Successfully added comment.")
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});	
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, function(err, foundComment) {
				if(err) {
					console.log(err);
					res.redirect("back");
				} else {
					res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
				}
			});
		}
	});
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
				if(err){
					console.log(err)
					res.redirect("back");
				} else {
					res.redirect("/campgrounds/" + req.params.id);
				}
			});	
		}			
	});
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			Comment.findByIdAndRemove(req.params.comment_id, function(err){
				if(err){
					console.log(err);
				} else {
					req.flash("success", "Comment deleted.")
					res.redirect("/campgrounds/" +req.params.id);
				}
			});
		}
	});	
});

module.exports = router;