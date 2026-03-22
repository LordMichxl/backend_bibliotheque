import bcryptjs from 'bcryptjs';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register =async (req,res)=>{
    const {name,email,password} = req.body;
    //hasher le mot de passe 
    const mdpHashed = await bcryptjs.hash(password,10);
    User.create({
        name,
        email,
        password:mdpHashed
    })
    .then (user => res.status(201).json({message: "utilisateur enregistré avec succès",user}))
    .catch(err=> res.status(400).json ({error: err.message}));
}

export const login = async(req,res)=>{ 
    const {email, password} = req.body;
    
     await User.findOne({where: {email}})
     //verifie si l'email existe
    .then (user => {
        if (!user) {
        return res.status(401).json({message: "utilisateur ou mot de passe incorrect"});
    }
    const isValidPwd = bcryptjs.compare(password, user.password);
    if (!isValidPwd) {
        return res.status(401).json({message: "utilisateur ou mot de passe incorrect"});
    }
    const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRES_IN });
    return res.status(200).json({token: token,message: "connexion réussie" });
    })
    .catch(err => res.status(500).json({error: err.message}));    
}

export const getProfile = async(req, res)=>{
    try {
        const user = await User.findByPk(req.userId, {
    attributes: { exclude: ['password'] }
    });
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
}