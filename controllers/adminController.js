const User = require("../models/User");
const bcrypt = require("bcrypt");
// const { search } = require("../routes/adminRouter");

exports.showLogin = (req,res)=>{
    if(req.session.user){
        return res.redirect("/home")
    }
    if(req.session.admin){
        return res.redirect("/admin/dashboard")
    }
    res.render("adminLogin");
}

exports.postLogin = async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.render("adminLogin",{error:"please fill all fields"});
        }

        const admin = await User.findOne({email});
        if(!admin){
            return res.render("adminLogin",{error:"Admin Not found"});
        }

        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.render("adminLogin",{error:"Incorrect Password"});
        }

        if(admin.role !== "admin"){
            return res.render("adminLogin",{error:"Access Denied: You are not an Admin"});
        }

        req.session.admin = {
            id:admin._id,
            name:admin.name,
            email:admin.email,
            role:admin.role
        }

        console.log("Admin Logged In",req.session.admin);
        return res.redirect("/admin/dashboard");
    
    }catch(err){
        console.error("Admin Login Error",err);
        res.status(500).send("Server error during admin login");
    }
}


exports.dashboard = async(req,res)=>{
    try{
        

        const search = req.query.search || "";

        const searchFilter = {
            $or:[
                {name:{$regex:search,$options:"i"}},
                {email:{$regex:search,$options:"i"}}
            ]
        }



        const users = await User.find(search? searchFilter:{});

        

        res.render("dashboard",{
            users,
            search,
            success:req.flash("success"),
            error:req.flash("error")
        });
    }catch(error){
        console.error(error);
        res.status(500).send("Server error");
    }
}


exports.addUserForm = (req,res)=>{
    res.render("addUser",{error:null,success:null});
}

exports.addUser = async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
           return res.render("addUser",{error:"All fields are required",success:null});
        }

        if (!name || !/^[A-Za-z ]+$/.test(name)) {
           return res.render("addUser",{error:"Username can only contain letters",success:null});
        }

        if(password.length<6){
            return res.render("addUser",{error:"Password need minimum 6 characters",success:null});
        }

        const emailRegex  = /^\S+@\S+\.\S+$/;
        if(!emailRegex.test(email)){
            return res.render("addUser",{error:"Invalid email format",success:null})
        } 

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.render("addUser",{error:"User with same email already exists",success:null});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })

        await newUser.save();
        req.flash("success","User added Successfully")
        return res.redirect("/admin/dashboard");
       

    }catch(err){
        console.error("Add new user error",err);
        req.flash("error","Error Adding user")
         return res.redirect("/admin/dashboard");
    }
}

exports.editUserForm = async(req,res)=>{
    try{
        const userId = req.params.id;
        const userToEdit = await User.findById(userId);

        if(!userToEdit){
            return res.render("editUser",{userToEdit:null,error:"User not found",success:null})
        }

        res.render("editUser",{userToEdit,error:null,success:null});
    }catch(err){
        console.error("error loading editForm",err);
        res.render("editUser",{error:"server error loading form",success:null,userToEdit:null});
    }
}

exports.updateUser = async(req,res)=>{
    try{
        const userId = req.params.id;
        const {name,email} = req.body;

        if(!name || !email){
            const userToEdit = await User.findById(userId,{name:name.trim(),email:email.trim()});
            return res.render("editUser",{userToEdit,error:"All fields are required",success:null});
        }

          if (!name || !/^[A-Za-z ]+$/.test(name)) {
             const userToEdit = await User.findById(userId,{name:name.trim(),email:email.trim()});
           return res.render("editUser",{userToEdit,error:"Username can only contain letters",success:null});
        }

         const emailRegex  = /^\S+@\S+\.\S+$/;
        if(!emailRegex.test(email)){
            return res.render("editUser",{userToEdit,error:"Invalid email format",success:null})
        } 

        const existingUser = await User.findOne({email});

        if (existingUser && existingUser._id.toString() !== userId) {
      const userToEdit = await User.findById(userId);
      return res.render('editUser', {
        userToEdit,
        error: 'Email already in use by another account',
        success: null
      });
    }

        await User.findByIdAndUpdate(userId,{name,email});

        
    req.flash("success","user updated successfully")
        res.redirect("/admin/dashboard");
    }catch(err){
        console.error("Error updating user",err);
      
        req.flash("error","Error updating user")
         res.redirect("/admin/dashboard");
    }
}

exports.deleteUser = async(req,res)=>{
    try{
        const userId = req.params.id;

        if(req.session.admin && req.session.admin.id === userId){
           
            req.flash("error","Admin cannot Be Deleted")
            return redirect("/admin/dashboard");
        }

         const user = await User.findByIdAndDelete(userId);

        if(!user){
            res.redirect("/admin/dashboard");
        }
        req.flash("success","User deleted successfully")
        res.redirect('/admin/dashboard');
    }catch(err){
        console.error("Error deleting user",err);
        req.flash("error","Something went wrong")
         res.redirect('/admin/dashboard');
    }
}

exports.adminLogout = (req,res)=>{
   
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    console.log("Admin logged Out");
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
}