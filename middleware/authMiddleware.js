exports.ensureAuth = async(req,res,next)=>{
    if(req.session && req.session.user){
        return next();
    }else{
        return res.redirect("/login");
    }

    
}


exports.ensureAdmin = async(req,res,next)=>{
    if(req.session && req.session.admin && req.session.admin.role ==="admin"){
        return next();
    }else{
      // if not admin go to Home
        return res.redirect("/home")
    }

}
