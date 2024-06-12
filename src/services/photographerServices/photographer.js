const Photographer = require('../../models/photographer');
const Event = require('../../models/event');
const Photos = require('../../models/photo');
const moment = require('moment');
const { default: mongoose } = require('mongoose');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');


const s3Client = new S3Client({
  credentials: {
    accessKeyId: "AKIAU6GDXABAWZLBA5UB",
    secretAccessKey: "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"
  },
  region: "ap-south-1"
})

// Function to get image from S3
const getPreSignedUrl = async (bucketName, imageKey) => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: imageKey
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return url;
  } catch (error) {
    console.log("error while getting getPreSignedUrl", error) 
  }
};

const generatePreSignedUrls = async (faces, bucketName) => {
  const facesWithId = faces.filter((elem) => elem.systemGenratedName != undefined)
  try {
    if(facesWithId.length <= 0){
      return []
    }else{
      const preSignedUrls = await Promise.all(
         facesWithId.map(async (face) => {
          const url = await getPreSignedUrl(bucketName, face.systemGenratedName);
          return {
            photoId: face._id,
            originalName: face.originalName,
            Url: url
          };
        })
      );
      return preSignedUrls;
    }
  } catch (error) {
    console.log("error from generatePreSignedUrls", error) 
  }
};


exports.createPhotographer = async (photographerData, authData=null) => {
    const response = {
        status: false,
        data: {
          message: "",
          response: {}
        }
    }

    try {

      const checkEvent = await Event.findById(photographerData.eventId);

      if(!checkEvent){
        response.status = false;
        response.data.message = "You don't have access to create Photographer!";
        return response;
      }

      const photographerDoc = new Photographer({
        name: photographerData.name,
        email: photographerData.email,
        phone: photographerData.phone,
        isActive: photographerData.isActive,
      });

      if(photographerData.expiryDate != undefined){
        photographerDoc.expiryDate = new Date(photographerData.expiryDate*1000)
      }

      const savedDoc = await photographerDoc.save();

      if(savedDoc){
        let update = {
         photographers: (() => {
          let temp = [];
          checkEvent.photographers.push({
            isActive: savedDoc.isActive,
            photographerId: savedDoc._id,
            link: `photographer/getphotos/:${checkEvent._id}/:${savedDoc._id}`
          })
          temp = checkEvent.photographers;
          return temp;
         })()
        }
        let result = await Event.updateOne({ _id: checkEvent._id }, update);  
      }
      response.status = true;
      response.message = "Successfully created the photographer!!";
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

exports.deletePhotographer = async (photographerId) => {
  const response = {
      status: false,
      data: {
        message: "",
        response: {}
      }
  }
 
  try {

    const resp = await Photographer.findByIdAndDelete(photographerId);
    if(!resp)
      return response;

    response.status = true;
    response.data.message = "Successfully deleted the photographer!!"

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

exports.updatePhotographer = async (photographerData) => {
  const response = {
      status: false,
      data: {
        message: "Photographer Not Found for Update!!",
        response: {}
      }
  }

  try {
   
    const update = {
      title: photographerData.title,
      vanue: photographerData.vanue,
      accessiblity: photographerData.accessiblity,
      category: photographerData?.category
    };

    const resp = await Photographer.findByIdAndUpdate(photographerData.photographerId, update);
    
    if(!resp)
       return response;

    response.status = true;
    response.data.message = "Successfully updated the photographer!!"

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

exports.getPhotographers = async (eventIds) => {
  const response = {
      status: false,
      data: {
        message: "Photographer not Found!",
        response: []
      }
  }

  try {
      const eventId = String(eventIds);
    
      const photographerDoc = await Photographer.find();
      const event = await Event.findOne(
        {
          _id: new mongoose.Types.ObjectId(eventId)
        }
      ).populate('photographers.photographerId'); // Populate to get photographer details if needed
  
      if(photographerDoc[0] != undefined){
        response.status = true;
        response.data.message = "Success";
        for(let element of event.photographers){
          let photosCount = 0;
          const photos = await Photos.find({photographerId: element.photographerId._id})
          if(photos != null && photos[0] != undefined)
            photosCount = photos.length;

          response.data.response.push(
            {
              photographerId: element.photographerId._id,
              name: element.photographerId.name,
              email: element.photographerId.email,
              phone: element.photographerId.phone ?? '-',
              isActive: element.photographerId.isActive ?? '-',
              expiryDate: element.photographerId.expiryDate ? moment(element.photographerId.expiryDate).format('DD/MM/YYYY') : '-',
              url: element.link,
              photosCount: photosCount
            }
          )
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

exports.getSinglePhotographer = async (photographerId) => {
  const response = {
      status: false,
      data: {
        message: "Photographer not Found!",
        response: {}
      }
  }

  try {
    const photographerDoc = await Photographer.findById(photographerId);

    if(photographerDoc){
      response.status = true;
      response.data.message = "Success";
      response.data.response = {
        photographerId: photographerDoc._id,
        name: photographerDoc.name,
        email: photographerDoc.email,
        phone: photographerDoc.phone ?? '-',
        isActive: photographerDoc.isActive ?? '-',
        expiryDate: photographerDoc.expiryDate ? moment(photographerDoc.expiryDate).format('DD/MM/YYYY') : '-',
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

exports.getPhotos = async (eventIds, photographerIds) => {
  const response = {
      status: false,
      data: {
        message: "No Photographer or Event Found!",
        response: {}
      }
  }
  const eventId = String(eventIds);
  const photographerId = String(photographerIds)
  const bucketName = "my-image-rekognition";
  
  try {
    const event = await Event.findOne(
      {
        _id: new mongoose.Types.ObjectId(eventId),
        'photographers.photographerId': new mongoose.Types.ObjectId(photographerId)
      },
      {
        'photographers.$': 1, // Project only the matched photographer
        'title': 1,
        'userId': 1,
      }
    ).populate('photographers.photographerId'); // Populate to get photographer details if needed
      
    if(event){
      response.status = true; 
      response.data.message = "Success";   
      response.data.response = {
        evnetId: event._id,
        photographerId: photographerId,
        photographerName: event.photographers[0].photographerId.name,
        email: event.photographers[0].photographerId.email,
        phone: event.photographers[0].photographerId.phone ?? '-',
        photos: []
      }

       
      const photos = await Photos.aggregate([
        {
          '$match': {
            'userId': new mongoose.Types.ObjectId(event.userId),
            'eventId': new mongoose.Types.ObjectId(event._id),
            'photographerId': new mongoose.Types.ObjectId(photographerId)
          }
        }
      ])

      if(photos != null && photos[0] != undefined){
        const actualRes = await generatePreSignedUrls(photos, bucketName);
        if(actualRes != undefined && actualRes[0] != undefined) 
          response.data.response.photos = actualRes;
      }else{
        response.status = true;
        response.data.message = "No Photos Found!!";    
      }
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