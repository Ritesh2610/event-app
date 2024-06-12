const moment = require('moment');
const Event = require('../../models/event');
const User = require('../../models/user');
const Photo = require('../../models/photo');
const { default: mongoose } = require('mongoose');

exports.createEvent = async (eventData, authData=null) => {
    const response = {
        status: false,
        data: {
          message: "You don't have access to create Event!",
          response: {}
        }
    }

    try {

      const checkUser = await User.findById(eventData.userId);

      if(!checkUser){
        return response;
      }

      const eventDoc = new Event({
        userId: checkUser._id,
        title: eventData.title,
        vanue: eventData.vanue,
        accessiblity: eventData.accessiblity,
        category: eventData.category,
        timestamp: eventData.timestamp != undefined ? new Date(eventData.timestamp*1000) : new Date()
      });

      const eventDB = await eventDoc.save();

      if(eventDB){
        let update = {
          guests: {
            allImagesUrl: `guests/getphotos/:${eventDB._id}`,
            selfieImageUrl: `guests/details/:${eventDB._id}`
          }
        }
        let result = await Event.updateOne({ _id: eventDB._id }, update);
      }

      response.status = true;
      response.data.message = "Successfully created the event!!"

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

exports.deleteEvent = async (eventId) => {
  const response = {
      status: false,
      data: {
        message: "",
        response: {}
      }
  }
 
  try {

    const resp = await Event.findByIdAndDelete(eventId);
    if(!resp)
      return response;

    response.status = true;
    response.data.message = "Successfully deleted the event!!"

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

exports.updateEvent = async (eventData) => {
  const response = {
      status: false,
      data: {
        message: "Event Not Found for Update!!",
        response: {}
      }
  }

  try {
   
    const update = {
      title: eventData.title,
      vanue: eventData.vanue,
      accessiblity: eventData.accessiblity,
      category: eventData?.category
    };

    const resp = await Event.findByIdAndUpdate(eventData.eventId, update);
    
    if(!resp)
       return response;

    response.status = true;
    response.data.message = "Successfully updated the event!!"

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

exports.getEvents = async (authData) => {
  const response = {
      status: false,
      data: {
        message: "Event not Found!",
        response: []
      }
  }

  try {
    
      const eventDoc = await Event.find({});
      
      if(eventDoc[0] != undefined){
        response.status = true;
        response.data.message = "Success";
        for(let element of eventDoc){
          let photosCount = 0;
          const photos = await Photo.find({eventId: element._id})
          if(photos != null && photos[0] != undefined)
            photosCount = photos.length;

          response.data.response.push(
            {
              userId: element.userId,
              eventId: element._id,
              title: element.title,
              timestamp: element.timestamp ? moment(element.timestamp).format('DD/MM/YYYY') : '-',
              vanue: element.vanue ?? '-',
              accessiblity: element.accessiblity ?? '-',
              category: element.category ?? '-',
              guestUrls: {
                allImagesUrl: element.guests.allImagesUrl,
                selfieImageUrl: element.guests.selfieImageUrl
              },
              photosCount: photosCount
            }
          )
        }
        eventDoc.forEach((element) => {
        })
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

exports.getSingleEvent = async (eventId) => {
  const response = {
      status: false,
      data: {
        message: "Event not Found!",
        response: {}
      }
  }

  try {
    const eventDoc = await Event.findById(eventId);

    if(eventDoc){
      response.status = true;
      response.data.message = "Success";
      response.data.response = {
        userId: eventDoc.userId,
        eventId: eventDoc._id,
        title: eventDoc.title,
        timestamp: eventDoc.timestamp ?? '-',
        vanue: eventDoc.vanue ?? '-',
        accessiblity: eventDoc.accessiblity ?? '-',
        category: eventDoc.category ?? '-',
        guestUrls: {
          allImagesUrl: eventDoc.guests.allImagesUrl,
          selfieImageUrl: eventDoc.guests.selfieImageUrl
        }
      };
    }

   return response;
  } catch (error) {
    console.log(error)
      const response = {
          status: false,
          data: {
            message: error
          },
      }     
      return response;
  }
}