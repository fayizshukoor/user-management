const User = require("../models/User");

exports.forceLogout = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const user = await User.findById(req.session.user.id);

    if (!user) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.redirect("/login");
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Session check error:", error);
    next();
  }
};

