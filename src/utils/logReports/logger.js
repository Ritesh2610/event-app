const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const configurationDebug = (app) => {
    console.log("process.env.NODE_ENV", process.env.NODE_ENV)
    try {

       if(process.env.NODE_ENV == 'development'){

           console.log('Morgan enabled in development mode');
   
           app.use(morgan('dev', {
           skip: function (req, res) { return res.statusCode < 400 }
           }))
      
           // log all requests to access.log
           app.use(morgan('common', {
               stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
           }))
       }        
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = configurationDebug;