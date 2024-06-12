const Users = require('../../../models/user');
const { Validator } = require('../../../utils/validator');

exports.signup = async (userData) => {
    const response = {
        status: false,
        message: "",
    }
    // const validate = Validator.validateRegisterForm(userData);
    // if(!validate.status){
    //   response.message = validate.message;
    //   return response; 
    // }

    try {
      
      const userDoc = new Users({
        name: userData.name,
        username: userData.username,
        email: userData.email,
        companyName: userData?.companyName,
        address: userData?.address,
        country: userData?.country
      });



      await userDoc.save();

      response.status = true;
      response.message = "Successfully created the account!!"

     return response;
    } catch (error) {
      console.log(error)
        const response = {
            status: false,
            message: error,
        }     
        return response;
    }
}