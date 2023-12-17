import express from 'express';

import { isAuthenticated ,isOwner} from '../middlewares';
import { showUserCars, addCar,deleteCar} from '../controllers/cars';



export default(router:express.Router)=>{
    router.get('/cars/:id/:cid',isAuthenticated,isOwner,showUserCars);
    router.post('/cars/:id',isAuthenticated,isOwner,addCar);
    router.post('/cars/:id/:cid',isAuthenticated,isOwner,deleteCar);
};5