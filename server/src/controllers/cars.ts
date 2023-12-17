import express from 'express';
import {createCar, deleteCarById, getCarByUser} from'../db/cars';


export const showUserCars =async (req:express.Request,res:express.Response) => {
    try{
        const {id}=req.params;
        const cars = await getCarByUser(id);
        return res.status(200).json(cars);
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
};
export const addCar =async (req:express.Request,res:express.Response) => {
    try {
        const { make, carModel, year, quality, owner } = req.body; 
       
        const car = await createCar({
            make,
            carModel,
            year,
            quality,
            owner
        });
        
        return res.status(201).json(car).end(); // Send back the created car object
    } catch (error) {
        console.error(error); // Log the error for server-side debugging
        return res.status(400).send('An error occurred: ' + error.message);
    } 
};
export const deleteCar = async(req:express.Request,res:express.Response)=>{
    try{
        const {cid} = req.params;
        
        const deleteCar = await deleteCarById(cid);

        return res.json(deleteCar);

    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
};