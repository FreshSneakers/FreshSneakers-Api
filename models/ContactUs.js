const mongoose = require('mongoose')

const contactScheme = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    message:{
        type: String,
        
    },
    incidences:{
        enum: []
        
        
    }
})



const Contact = mongoose.model('Contact', contactScheme)

module.exports = Contact