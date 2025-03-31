const mongoose = require('mongoose');
const dbgr = require('debug')("development:mongoose");
const config=require('config');

mongoose.connect(`${config.get("MONGODB_URI")}/decorico`)
    .then(() => dbgr("MongoDB connected successfully"))
    .catch(err => dbgr("MongoDB connection error:", err));
