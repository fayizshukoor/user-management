const express = require("express");
const router = express.Router();
const {postSignUp,signUp,loadLogin,postLogin,homePage,userLogout} = require("../controllers/userController");
const { ensureAuth } = require("../middleware/authMiddleware");
const {forceLogout} = require("../middleware/forceLogout")
const {noCache} = require("../middleware/noCache");
const nocache = require("nocache");

router.get("/signup",noCache,signUp);

router.post("/signup",noCache,postSignUp);

router.get("/login",noCache,loadLogin);

router.post("/login",noCache,postLogin);

router.get("/home",noCache,ensureAuth,forceLogout,homePage);

router.get("/logout",noCache,userLogout);

    

module.exports = router;