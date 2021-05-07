const nodemailer = require('nodemailer')
const { generateTemplate } = require('./mailtemplate.js')

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD
    }
})

module.exports.sendActivationEmail = (email, token) => {
    transporter.sendMail({
        from: `"FreshSneakers" <${process.env.NM_USER}>`,
        to: email,
        subject: 'Thanks for joining us!',
        html: generateTemplate(email, token)
    }, (err, info) =>  {
        if(err){
            console.log('error mail');
            console.log(err);
        }
    })
}
