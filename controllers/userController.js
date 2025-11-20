const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.loadLogin = (req,res)=>{
    if(req.session.user){
        return res.redirect("/home");
    }
    if(req.session.admin){
        return res.redirect("/admin/dashboard");
    }
        return res.render("login")
    
    
}

exports.postLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.render("login",{error:"Fill All Fields"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.render("login",{error:"Invalid Credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
           return res.render("login",{error:"Incorrect Password"});
        }

         if(user.role === "admin"){
            return res.render("login",{error:"Admins cannot Login from User Login"});
        }

        req.session.user = {
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }

        console.log("User Logged in Successfully",req.session.user);

       return  res.redirect('/home');


    }catch(err){
        console.error("Login error",err);
        return res.status(500).send("server error")
    }
}

exports.signUp =  (req,res)=>{
    if(req.session.user){
        return res.redirect("/home");
    }
        return res.render("signup")
}

exports.postSignUp = async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.render("signup",{error:"All fields are required"});
        }

          if (!name || !/^[A-Za-z ]+$/.test(name)) {
           return res.render("signup",{error:"Username can only contain letters"});
        }

        if(password.length<6){
            return res.render("signup",{error:"Password need minimum 6 characters"});
        }

        const emailRegex  = /^\S+@\S+\.\S+$/;
        if(!emailRegex.test(email)){
            return res.render("signup",{error:"Invalid Credentials"})
        } 

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.render("signup",{error:"Email already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password:hashedPassword
        });

        await newUser.save();
        return res.redirect("/login");

    }catch(err){
        console.error("SignUp error:",err);
        res.status(500).send("Error signing Up");
    }
}

exports.homePage = (req,res)=>{
    try{
        if(req.session.user.role === "admin"){
        return res.redirect("/admin/dashboard");
    }

    if(!req.session.user){
        res.redirect("/login");
    }
    res.render("home",{user:req.session.user});

    }catch(err){
        console.error("Error loading homepage");
        res.status(500).send("Error loading home page")
    }
}

exports.userLogout = (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error("Logout error:",err);
            return res.send("Error loggin out");
        }
        console.log("User logged Out");
        res.clearCookie("connect.sid");
        res.redirect("/login");
    })
}
