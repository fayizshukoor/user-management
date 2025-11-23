require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const nocache = require("nocache");

const adminRoutes = require("./routes/adminRouter");
const userRoutes = require("./routes/userRouter");

const app = express();

connectDB();



app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  store:MongoStore.create({
    mongoUrl:process.env.MONGODB_URI,
    collectionName:"sessions",
    ttl:24*60*60,
    autoRemove:"native" 
  }),
  cookie:{
    maxAge:1000*60*60*24,
    httpOnly:true
  }
}));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));


app.use(nocache());

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/",userRoutes);
app.use("/admin",adminRoutes);



app.get('/',(req,res)=>{
    res.redirect("/login");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}/login`);;
})

