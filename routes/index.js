const express   = require("express"),
      router    = express.Router(),
      passport  = require("passport"),
      User      = require("../models/user");

//ROOT ROUTE
router.get("/", (req, res) => {
    res.render("landing");
});

// ==================
// AUTH ROUTES
// ==================

//Registration form route
router.get("/register", (req, res) => {
    res.render("register");
});

//Handing Sign Up Logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect('register');
        }
        passport.authenticate("local")(req, res, () =>{
           req.flash(`success", "Welpcome to MyYelpCamp! "${user.username}"`);
           res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", (req, res) => {
    res.render("login");
});

//Handing Log in logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

//Logout
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;