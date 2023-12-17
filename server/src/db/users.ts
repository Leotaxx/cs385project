import mongoose,{Document,Schema} from "mongoose";
import CarModel from "./cars";

export interface IUser extends Document{
    email:string;
    username:string;
    authentication:{
        password:string;
        salt:string;
        sessionToken?:string;
    }
    cars:mongoose.Types.ObjectId[]
}


const UserSchema = new mongoose.Schema(
    {
        email:{type:String,required:true},
        username:{type :String ,required:true}, 
        authentication:{
            password:{type:String,required:true,select:false},
            salt:{type:String,required:true,select:false},
            sessionToken:{type:String,select:false},
        },
        cars: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car'
        }]
    }
);

export const UserModel = mongoose.model<IUser>('User',UserSchema);
export const getUsers = ()=>UserModel.find();
export const getUserByEmail = (email:string)=>UserModel.findOne({email});
export const getUserBySessionToken=(sessionToken:string)=>UserModel.findOne({'authentication.sessionToken':sessionToken});
export const getUserById=(id:string)=>UserModel.findById(id).populate('cars');
export const createUser=(values:Record<string, any>)=>new UserModel(values).save().then((user)=>user.toObject());
export const deleteUserById = async (userId: string) => {
    try {
        // Find the user and their associated cars
        const user = await UserModel.findById(userId).exec();
        if (!user) {
            console.log('User not found');
            return; // or handle this case as needed
        }

        // If the user has cars, remove them
        if (user.cars.length > 0) {
            await CarModel.deleteMany({ _id: { $in: user.cars } });
        }

        // Delete the user
        await UserModel.findByIdAndDelete(userId);
        console.log('User and their cars have been successfully deleted');
    } catch (error) {
        console.error('Error deleting user:', error.message);
        // Handle the error appropriately
    }
};
export const updateUserById=(id:string,values:Record<string,any>)=>UserModel.findByIdAndUpdate(id,values);