const express = require('express');
const router = express.Router()
const User = require('../models/user');
const multer = require('multer');
const { now } = require('mongoose');
const fs=require('fs');

//image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single('uploadpic');

//Insert an user into database route

router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.firstname,
            email: req.body.email,
            phone: req.body.phonenumber,
            image: req.file.filename
        });
        const data = await user.save();
        req.session.message = {
            type: 'success',
            message: 'User added successfully!',
        };  
        res.redirect('/');
    } catch (error) {
        res.json({ message: err.message, type: 'danger' })
    }
    /*try {
        const user = new User({
            name: req.body.firstname,
            email: req.body.email,
            phone: req.body.phonenumber,
            image: req.file.filename
        });
        const data = await user.save();
        res.redirect('/').status(201);
    } catch (error) {
        res.status(400).send(error);
    }*/

})

//Get All users route
router.get('/',async (req, res) => {
    
    try {
        const data=await User.find();
        res.render('index',{userdata:data})
    } catch (error) {
        res.status(500).json({message:error.message});
    } 
    
})

router.get("/add", (req, res) => {
    res.render('add_users', { title: "Add Users" });
})

//Edit an user route
router.get('/edit/:id',async (req,res)=>{
    try {
        let id=req.params.id;   
        const data=await User.findById(id);
        res.render("edit_users",{userdata:data});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//Update user route
router.post('/edit/:id', upload, async (req, res) => {
    let id=req.params.id;
        let new_image='';   
        if(req.file)
        {
            new_image=req.file.filename;
            try {
                fs.unlinkSync('./uploads/'+req.body.old_image)
            } catch (error) {
                console.log(error)   
            }
            
        }else{
            new_image=req.body.old_image;
        }
        const userdata=await User.findByIdAndUpdate(id,{
            name: req.body.firstname,
            email: req.body.email,
            phone: req.body.phonenumber,
            image: new_image
        });
        res.redirect("/")

})

//Delete user route
router.get("/delete/:id",async (req, res) => {
    try {
        let id=req.params.id;
        const data=await User.findOneAndDelete({_id:id});
        fs.unlinkSync('./uploads/'+data.image);
        res.redirect("/")
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
      
})

module.exports = router;