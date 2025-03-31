const ownerModel = require("../models/owner-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

// Register an Owner
module.exports.registerOwner = async function (req, res) {
    try {
        let { email, fullname, password, gstin } = req.body;

        let owners = await ownerModel.find();
        if (owners.length > 0) {
            req.flash("error", "Only one owner is allowed.");
            return res.redirect("/owners/create-owner");
        }

        let existingOwner = await ownerModel.findOne({ email: email });
        if (existingOwner) {
            req.flash("error", "Owner with this email already exists.");
            return res.redirect("/owners/create-owner");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let picture = req.file ? req.file.buffer.toString("base64") : null;
                    let owner = await ownerModel.create({
                        email,
                        password: hash,
                        fullname,
                        gstin,
                        picture,
                    });

                    let token = generateToken(owner);
                    res.cookie("token", token);
                    req.flash("success", "Owner account created successfully.");
                    return res.redirect("/owners/admin");
                }
            });
        });
    } catch (err) {
        res.send(err.message);
    }
};

// Owner Login
module.exports.loginOwner = async function (req, res) {
    try {
        let { email, password } = req.body;
        let owner = await ownerModel.findOne({ email });

        if (!owner) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/owners/create-owner");
        }

        bcrypt.compare(password, owner.password, function (err, result) {
            if (result == true) {
                let token = generateToken(owner);
                res.cookie("token", token);
                res.redirect("/owners/admin");
            } else {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/owners/create-owner");
            }
        });
    } catch (err) {
        res.send(err.message);
    }
};

// Owner Logout
module.exports.logoutOwner = async function (req, res) {
    res.cookie("token", "");
    res.redirect("/owners/create-owner");
};
