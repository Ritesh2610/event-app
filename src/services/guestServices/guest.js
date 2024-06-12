const { default: mongoose } = require('mongoose');
const Event = require('../../models/event');


exports.getDetails = async (eventIds) => {
    const response = {
        status: false,
        data: {
          message: "No Photographer or Event Found!",
          response: {}
        }
    }
    const eventId = String(eventIds);
    
    try {
      const event = await Event.findOne({_id: new mongoose.Types.ObjectId(eventId)})
    
      if(event){
        response.status = true; 
        response.data.message = "Success";   
        response.data.response = {
          evnetId: event._id,
          userId: event.userId,
          title: event.title,
          category: event.category
        }
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