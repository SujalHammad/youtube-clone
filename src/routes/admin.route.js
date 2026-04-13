const express=require("express");
const { verifyJwt } = require("../middlewares/auth.middleware");
const { getAllUser } = require("../controllers/admin.controller.js");
const { isAdmin } = require("../middlewares/checkAdmin.js");

const adminRoute=express.Router();

adminRoute.get("/getAllUser",verifyJwt,isAdmin,getAllUser)

module.exports={adminRoute}