const mongoose = require('mongoose');
const multer = require('multer');

const path = require('path');
const imagepath = "/upload";

const studentschema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    gender: {
        type: String,
        require: true,
    },
    hobbies: {
        type: Array,
        require: true,
    },
    city: {
        type: Array,
        require: true,
    },
    adminimage: {
        type: String,
        require: true,
    }
});

const storege = multer.diskStorage({
    destination: function (req, file, cb) {                     //req avse te pramane cb chale ane image kya upload krvi te path devase// 
        cb(null, path.join(__dirname, "..", imagepath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now())
    }
});


studentschema.statics.uploadImage = multer({ storage: storege }).single("adminage");
studentschema.statics.imageModelPath = imagepath;



const student = mongoose.model('student', studentschema);
module.exports = student;
