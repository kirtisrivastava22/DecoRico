const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const { registerOwner, loginOwner, logoutOwner } = require("../controllers/ownersController");

if (process.env.NODE_ENV === "development") {
    router.post("/create", upload.single("picture"), registerOwner);
}

router.post("/ownerlogin", loginOwner);

router.get("/logout", logoutOwner);

router.get("/create-owner", function (req, res) {
    let error = req.flash("error");
    res.render("create-owner", { error });
});

router.get("/admin", function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

module.exports = router;
