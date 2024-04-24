const PlayerUser = require("../models/PlayerUser")
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const signinPage = (req, res) =>{
    res.render('signinPage.ejs')
}

// Route 1: route for the api with the route og http://localhost:3300/createuser
const createUser = async (req, res) => {
    try {
        userEmail = (await PlayerUser.find({ email: req.body.email })).length
        if (userEmail == 0) {
            const user = await PlayerUser.create({
                name: req.body.name,
                email: req.body.Email,
                password: req.body.password
            })

            const data = {
                user: {
                    id: user._id
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);

            success = true;
            res.json({ success, authtoken });
        } else {
            return res.status(400).json({ error: "Email Id already Exists" })
        }
    } catch (err) {
        res.status(500).send("Internal Server Error occured while Authennticating")
    }
}

// Route 2: route for the api with the route of http://localhost:3300/login
const login = async(req, res)=>{
    let success = false;

    try {
        const user = await PlayerUser.findOne({email: req.body.Email})
        if(user){
            const comparePass = user.password == req.body.password;
            // console.log(comparePass); // true
            if(comparePass){
                const data = {
                user: {
                    id: user._id
                }
            }
            success = true;
            const authtoken = jwt.sign(data, JWT_SECRET);    
            res.json({success,authtoken});
            }
            else{
                return res.status(400).json({error: "User does not Exists / Invalid Credentials"
            })
        }
            
            
        }else{
            return res.status(400).json({error: "User does not Exists / Invalid Credentials"})
        }
    } catch (err) {
        res.status(500).send("Internal Server Error occured while Authennticating")
    }
}

// Route 3: route for the api with the route of http://localhost:3300/getuser
const getUser = async(req, res)=>{

    try {
        const userId = req.user.id; 
        const user = await PlayerUser.findById(userId).select("-password"); 
        res.send(user);
    } catch (err) {
        res.status(500).send("Internal Server Error occured while getting the user from JWT token || MiddleWare")
    }
}


module.exports = { signinPage, createUser, login, getUser } 