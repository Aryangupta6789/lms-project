import mongoose from "mongoose";


const connectDB = async ()=>{
    console.log('ENV URI =>', process.env.MONGODB_URI)
    mongoose.connection.on('connected',()=>console.log('connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
}
export default connectDB