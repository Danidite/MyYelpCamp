const  Campground    = require("../models/campground"),
       Comment       = require("../models/comment");

//All the middleware goes here
const middlewareObj = {
    isLoggedIn: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        } 
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    },
    checkCampgroundOwnership: async (req, res, next) => {
        try {
            if(req.isAuthenticated()) {
                let foundCampground = await Campground.findById(req.params.id);
                if(foundCampground.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        } catch (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
    },
    checkCommentOwnership: async (req, res, next) => {
        try {
            if(req.isAuthenticated()) {
                let foundComment = await Comment.findById(req.params.comment_id);
                if(foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
        } catch (err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
    }
};

module.exports = middlewareObj;