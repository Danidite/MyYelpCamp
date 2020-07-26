const express       = require("express"),
      Campground    = require("../models/campground"),
      router        = express.Router(),
      Comment       = require("../models/comment"),
      middleware    = require("../middleware");

// INDEX ROUTE
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, price: price, image: image, description:desc, author: author};
    Campground.create (newCampground, (err, campground) => {
        if(err) {
            console.log(err);
            req.flash("error", "Failed to create a new campground!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground successfully created");
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            req.flash("error", "Unable to update campground");
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
    try {
        let campgroundRemoved = await Campground.findByIdAndRemove(req.params.id);
        await Comment.deleteMany( {_id: { $in: campgroundRemoved.comments }});
        req.flash("success", "Campground successfully deleted");
        res.redirect("/campgrounds");
    } catch (error) {
        console.log(error);
        req.flash("error", "Campground not found");
        res.redirect("/campgrounds");
    }
});

module.exports = router;