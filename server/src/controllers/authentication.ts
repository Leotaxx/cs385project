import { getUserByEmail,createUser } from '../db/users';
import express from 'express';
import { random,authentication } from '../helpers';

export const login = async (req:express.Request,res:express.Response)=>{
    try{
        const { email, password} = req.body;

        if(!email||!password){
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.sendStatus(400);
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password!=expectedHash){
            return res.sendStatus(403);
        }
        const salt =random();
        user.authentication.sessionToken = authentication(salt,user._id.toString());
        await user.save();
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
             // Adjust according to your requirements
            // Dynamically set domain based on environment
            domain: process.env.NODE_ENV === 'production' ? 'montblanc.azurewebsites.net' : 'localhost'
        };
        
        res.cookie('LEO-REST-API', user.authentication.sessionToken,cookieOptions );
        return res.status(200).json(user);
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req:express.Request,res:express.Response)=>{
    try{
        const{email,password,username} =req.body;
        if(!email||!password||!username){
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.sendStatus(400);
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication:{
                salt,
                password:authentication(salt,password),
            },
        });

        return res.status(200).json(user).end();
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
} ;