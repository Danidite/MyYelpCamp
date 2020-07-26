//Importing libraries
const express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      methodOverride        = require("method-override"),
      flash                 = require("connect-flash");

//Importing Models and Schematics

const User      = require("./models/user"), 
      seedDB    = require("./seeds");

//Requiring routes
const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      indexRoutes       = require("./routes/index");

// APP CONFIG
// mongoose.connect('mongodb://localhost:27017/my_yelp_camp', {
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true
// })
mongoose.connect('mongodb+srv://danielsuniqueyelpcampwithpassword:danielsuniqueyelpcampwithpassword@cluster0.tccsh.mongodb.net/my_yelp_camp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGERATION
app.use(require("express-session")({
    secret: "This is a super secret code, please do not reveal this to anyone else!!! Like EVER",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res , next) => {
    res.locals.currentUser = req.user;
    res.locals.error =req.flash("error");
    res.locals.success =req.flash("success");
	next();
});

// seedDB(); //Seed the dadabase
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("The MyYelpCamp Server Has Started!");
});