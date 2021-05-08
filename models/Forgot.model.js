const mongoose = require('mongoose')

const contactScheme = new mongoose.Schema({
   
    email:{
        type:String,
        require:true
    },
    
})



const Forgot = mongoose.model('Forgot', contactScheme)

module.exports = Forgot