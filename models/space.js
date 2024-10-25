import mongoose from 'mongoose'
const spaceSchema = new mongoose.Schema({
    sapce_id:{
        type:String,
        required:true,
        unique: true
    },
    space_name:{
        type:String,
        required:true,
        unique: true
    },
    json_data:{
        type:Object,
        required:true
    }
})

const Space = mongoose.model('Space', spaceSchema);

export {Space};