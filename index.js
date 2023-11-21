const express = require('express');
const mongoose=require('mongoose');
// const db = require('./config/mongoose');    //what is use of db//
mongoose .connect("mongodb+srv://rjpro111:create1008@mynewpro.cwut7oq.mongodb.net/info", {
    useUnifiedTopology: true,
    useNewUrlParser: true, })
    .then(() => console.log('Database connected.'))
    .catch(err => console.log(err));

const port = 8001;

const fs = require('fs');
const app = express();
const path = require('path');
const student = require('./models/Student');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/upload", express.static(path.join(__dirname, 'upload')));
app.use(express.urlencoded());      

app.get('/', function (req, res) {
    // console.log("hii");
    return res.render('add_detailes');
});

// app.get('/',function(req,res){
//     return res.render('add_detailes');
// });

app.get("/deletestudent/:id", async function (req, res) {
    // console.log(req.params.id);
    let olddata = await student.findById(req.params.id);
    if (olddata.adminimage) {
        let fullpath = path.join(__dirname, olddata.adminimage);
        console.log(fullpath);
        await fs.unlinkSync(fullpath);
    }
    await student.findByIdAndDelete(req.params.id);
    return res.redirect('back');
    // return res.redirect("view_detailes");
});

app.get("/updatestudent/:id", async function (req, res) {
    let record = await student.findById(req.params.id);
    return res.render('update', {
        oldstuid: record
    })
});

app.post('/editstudent', student.uploadImage, async function (req, res) {
    if (req.file) {
        let olddata = await student.findById(req.body.editid);
        if (olddata.adminimage) {
            let fullpath = path.join(__dirname, olddata.adminimage);
            await fs.unlinkSync(fullpath);
            var imagePath = "";
            imagePath = student.imageModelPath + "/" + req.file.filename;
            req.body.adminimage = imagePath;
            
            await student.findByIdAndUpdate(req.body.editid, req.body);  //1.je update karvanu che te 2.je deta use kari data update karvano che.//
            return res.redirect('/views_detailes');
        }
    }
    else {
        let olddata = await student.findById(req.body.editid);
        console.log(olddata);
        req.body.adminimage = olddata.adminimage;
        await student.findByIdAndUpdate(req.body.editid, req.body);
        return res.redirect('/views_detailes');
    }


    // await student.findByIdAndUpdate(req.body.editid, req.body);
    // return res.redirect('/views_detailes');
});

app.post('/addstudetailes', student.uploadImage, async function (req, res) {

    var imagePath = "";
    if (req.file) {
        imagePath = student.imageModelPath + "/" + req.file.filename;
    }
    req.body.adminimage = imagePath;
    await student.create(req.body);
    return res.redirect('back');

    // console.log(req.body);
    // student.create(req.body,function(err,data){
    //     if(err){
    //         console.log("something wronge");
    //     }                                     //callback function server ma work nathi karta atle async await mukvu pade che niche parmane//
    //     return res.redirect("back");
    // })
    // return console.log("record insert successfully");
    // ---------------------------------------------------------------------------//
    // app.post('/addstudetailes', async function (req, res) {
    //     let data = await student.create(req.body);
    //     if (data) {
    //         console.log("record inserted");          //callback function server ma work nathi karta atle async await mukvy//
    //         return res.redirect('back');
    //     }
    //     else {
    //         console.log("something went wronge");
    //         return res.redirect('back');
    //     }
    //     console.log(req.file);
    //     console.log(req.body);
    // }
});

app.use("/upload", express.static(path.join(__dirname, 'upload')));

app.get('/views_detailes', async (req, res) => {
    let data = await student.find({});
    return res.render('views_detailes', {
        stdetailes: data
    });

})

app.listen(port, (err) => {
    if (err) {
        console.log("someting went wronge");
    }
    console.log(`your server is coonect with port${port}`);
})

