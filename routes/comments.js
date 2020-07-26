const express       = require("express"),
      Campground    = require("../models/campground"),
      router        = express.Router({mergeParams:true}),
      Comment       = require("../models/comment"),
      middleware    = require("../middleware");

//Comments NEW
router.get("/new", middleware.isLoggedIn, (req,res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments Create
router.post("/", middleware.isLoggedIn, (req,res) => {
    Campground.findById(req.params.id, async (err, campground) => {
        try {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong!");
                res.redirect("/campgrounds");
            } else {
                let comment = await Comment.create(req.body.comment);
                comment.author.id = req.user._id;
                comment.author.username = req.user.username
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Successfully added comment!");
                res.redirect(`/campgrounds/${campground._id}`);
            }
        } catch(error) {
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async(req, res) => {
    try {
        let foundComment = await Comment.findById(req.params.comment_id);
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
    }
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, async(req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        req.flash("success", "Successfully edited comment!");
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
    }
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, async(req, res) => {
    try {
        await Comment.findByIdAndRemove(req.params.comment_id);
        req.flash("success", "Successfully deleted comment!");
        res.redirect(`/campgrounds/${req.params.id}`);
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
    }
});

module.exports = router;
