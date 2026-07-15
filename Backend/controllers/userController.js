const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req,res) {
    try{
        const {name, email, password, phoneNumber} = req.body;

        if(!name || !email || !password || !phoneNumber){
            return res.status(404).json({
                message : "All fields are required"
            })
        }

        const isEmail = await userModel.findOne({email});

        if(isEmail){
            return res.status(404).json({
                message : "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name : name,
            email : email,
            password : hashedPassword,
            phoneNumber : phoneNumber
        })

        res.status(200).json({
            success : true,
            message : "User registered successfully"
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
};

async function loginUser(req,res){
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(404).json({
                message : "All fields are required"
            })
        }

        const user = await userModel.findOne({email});

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        const verifyPassword = await bcrypt.compare(password, user.password);

        if(!verifyPassword){
            return res.status(404).json({
                message : "Invalid password"
            })
        }

        const token = jwt.sign(
            {_id : user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7D"}
        )

        res.status(200).json({
            message : "Login Successful",
            success : true,
            token
        })

    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
};

module.exports = {registerUser, loginUser};