const express = require("express");
const router = express.Router();
const User = require("../models/User");
const adminController = require("../controllers/adminController");
const { ensureAdmin } = require("../middleware/authMiddleware");
const {noCache} = require("../middleware/noCache");


router.get("/login",noCache,adminController.showLogin);

router.post("/login",noCache,adminController.postLogin);

router.get("/dashboard",noCache,ensureAdmin,adminController.dashboard);

// add User routes
router.get("/add-user",noCache,ensureAdmin,adminController.addUserForm);

router.post("/add-user",ensureAdmin,adminController.addUser);

//Edit user routes
router.get("/edit/:id",noCache,ensureAdmin,adminController.editUserForm);

router.post("/edit/:id",ensureAdmin,adminController.updateUser);

//Delete user routes

router.post("/delete/:id",ensureAdmin,adminController.deleteUser);

router.get("/logout",noCache,adminController.adminLogout);

module.exports = router;