const User = require('../../models/user');

exports.createUser = async (userData, authData=null) => {
    const response = {
        status: false,
        data: {
          message: ""
        }
    }

    try {
      if(authData.userType != "admin"){
         response.message = "You don't have access to create user!!"
         return response;
      }

      const userDoc = new User({
        name: userData.name,
        username: userData.email,
        email: userData.email,
        companyName: userData?.companyName,
        address: userData?.address,
        country: userData?.country,
        isSubscribed: userData?.isActive,
        createdBy: authData.userType
      });

      const savedUser = await userDoc.save();

      if(savedUser){
        response.status = true;
        response.data['userId'] = savedUser._id
        response.data.message = "Successfully created the account!!"
      }


     return response;
    } catch (error) {
      console.log(error)
        const response = {
            status: false,
            data: {
              message: error
            }
        }     
        return response;
    }
}

exports.deleteUser = async (userId, authData=null) => {
  const response = {
      status: false,
      data: {
        message: "No User Found!",
      }
  }

  try {

    if(authData.userType != "admin"){
      response.data.message = "You don't have access to delete user!!"
      return response;
   }

    const resp = await User.findByIdAndDelete(userId);

    if(!resp)
      return response;
    
    response.status = true;
    response.data.message = "Successfully deleted the account!!"

   return response;
  } catch (error) {
    console.log(error)
      const response = {
          status: false,
          data: {
            message: error
          }
      }     
      return response;
  }
}

exports.updateUser = async (userData) => {
  const response = {
      status: false,
      data: {
        message: "No User Found for Update!"
      }
  }

  try {
   
    const update = {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      companyName: userData?.companyName,
      address: userData?.address,
      country: userData?.country,
      isSubscribed: userData?.isActive,
      createdBy: userData?.createdBy
    };

    const resp = await User.findByIdAndUpdate(userData._id, update) 

    if(!resp)
      return response;

    response.status = true;
    response.data.message = "Successfully updated the account!!"

   return response;
  } catch (error) {
    console.log(error)
      const response = {
          status: false,
          data: {
            message: error
          }
      }     
      return response;
  }
}

exports.getUsers = async (authData) => {
  const response = {
      status: true,
      data: {
        message: "User Not Found!!",
        response: []
      },
  }

  try {
    if(authData.userType == "admin"){
      const userDoc = await User.find();
  
      if(userDoc[0] != undefined){
        response.status = true;
        response.data.message = "Success";
        userDoc.forEach(element => {
          response.data.response.push({
            userId: element._id,
            name: element.name,
            email: element.email,
            userType: element.userType,
            companyName: element.companyName,
            address: element.address ?? '-',
            country: element.country ?? '-',
            isActive: element.isSubscribed
          })
        });
      }
    }else{
        response.status = false;
        response.data.message = "You are not an Authorized Person to get all users!!";
    }

   return response;
  } catch (error) {
    console.log(error)
      const response = {
          status: false,
          data: {
            message: error
          }
      }     
      return response;
  }
}

exports.getSingleUser = async (userId) => {
  const response = {
      status: false,
      data: {
        message: "User Not Found!!",
        response: {}
      },
  }

  try {
    const userDoc = await User.findById(userId);

    if(userDoc){
      response.status = true;
      response.data.message = "Success";
      response.data.response = {
        userId: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        userType: userDoc.userType,
        companyName: userDoc.companyName,
        address: userDoc.address ?? '-',
        country: userDoc.country ?? '-',
        isSubscribed: userDoc.isSubscribed
      };
    }

   return response;
  } catch (error) {
    console.log(error)
      const response = {
          status: false,
          data: {
            message: error
          }
      }     
      return response;
  }
}
