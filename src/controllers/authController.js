const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();


///  Register User ///


exports.register = async(req,res) => {

    try {
        console.log(req.body)
        const {name,email,password,role} = req.body;

        if(!name || !email || !password || !role){

            return res.status(400).json({message:"Missing fields"});
        }

        const existing = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if(existing.rows.length){
            
            return res.status(400).json({message:'Email exists'});

        }

       const hash = await bcrypt.hash(password,10);

       await db.query(
        `INSERT INTO users(name,email,password_hash,role)
        VALUES($1,$2,$3,$4)`,
        [name,email,hash,role]
       );
        
       res.json({message:'Registered'});

    } catch (error) {
        
        res.status(500).json({message:error.message});

    }
};


///   Login User   ////

exports.login = async(req,res) => {

    try {
        
        const {email,password} = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE email= $1',
            [email]
        );

        if(!result.rows.length){

            return res.status(404).json({message:'User not found'});

        }

        const user = result.rows[0];

        const match = await bcrypt.compare(
            password,
            user.password_hash
        );

        if(!match){

            return res.status(400).json({message:'Wrong password'});

        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.jWT_SECRET,
            {expiresIn: '1d'}
        );

        res.json({token});

    } catch (error) {
        
        res.status(500).json({message:error.message});

    }
};