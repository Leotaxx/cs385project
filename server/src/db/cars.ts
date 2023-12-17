import mongoose ,{Document,Schema}from 'mongoose';
import {IUser, UserModel} from './users';
import cars from 'router/cars';

interface ICar extends Document{
    make:string;
    carModel:string;
    year:number;
    quality:string;
    owner:IUser['_id'];
}
const carSchema = new mongoose.Schema({
    make:{type:String,required:true},
    carModel:{type:String,required:true},
    year:{type:String,required:true},
    quality:{type:String,required:true},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})
carSchema.statics.doesUserOwnCar =async function (userId:mongoose.Types.ObjectId):Promise<boolean> {
    const count = await this.countDocuments({owner:userId}).exec();
    return count >0;
    
}
carSchema.post<ICar>('save',async function(){
    try{
        await UserModel.findByIdAndUpdate(       
            this.owner,
            {$push:{cars:this._id}},
            {new:true,useFindAndModify:false}
        );
        
    }catch(error){
        console.log(error.message);
        
    } 
    
});

    

export const CarModel = mongoose.model<ICar>('Car',carSchema);

export const getCars=()=>CarModel.find();
export const getCarByUser =(id:string)=>CarModel.find({owner:id});
export const createCar = (value:Record<string,any>)=> new CarModel(value).save().then((car)=>car.toObject());
export const deleteCarById = async (id: string) => {
    try {
        // Find the car document first
        const car = await CarModel.findById(id).exec();
        if (!car) {
            console.log('Car not found');
            return; // or handle this case as needed
        }

        // Perform necessary updates
        await UserModel.findByIdAndUpdate(
            car.owner,
            { $pull: { cars: car._id } },
            { new: true, useFindAndModify: false }
        );

        // Remove the car document
        await car.deleteOne();
    } catch (error) {
        console.error('Error deleting car:', error.message);
        // Handle the error appropriately
    }
};

export default CarModel;