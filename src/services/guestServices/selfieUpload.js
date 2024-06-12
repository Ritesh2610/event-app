const Event = require('../../models/event');
const { default: mongoose } = require('mongoose');
const Photos = require('../../models/photo');
const { listFacesInCollection, searchFacesByImage } = require('../../utils/awsServices/rekognitionService');
const { generatePreSignedUrls } = require('../../utils/awsServices/s3Service');


exports.selfieUpload = async (eventId, data) => {
    const response = {
        status: true,
        data: {
          message: "",
          response: []
        }
    }
    
    const bucketName = "my-image-rekognition";
    const collectionId = "image-rekognition";
  
    try {
      const resultList = await listFacesInCollection(collectionId);


      const event = await Event.findOne({_id: new mongoose.Types.ObjectId(eventId)}) 

      if(event){
        // Search faces by image
        const startTime = Date.now();        
        const matchedFaces = await searchFacesByImage(bucketName, data.selfie[0].originalname, collectionId, data.selfie[0].buffer)
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`searchFacesByImage took ${duration} milliseconds.`);

        if(matchedFaces.FaceMatches != undefined && matchedFaces.FaceMatches.length > 0){
          const actualRes = await generatePreSignedUrls(matchedFaces.FaceMatches, bucketName);  
          if(actualRes.length > 0){
            const result = [];
            const photos = await Promise.all(actualRes.map(async (elem) => {
              const photo = await Photos.findOne({ 
                eventId: new mongoose.Types.ObjectId(event._id), 
                systemGenratedName: elem.ExternalImageId 
              });
              return { ...elem, photoDB: photo };
            }));
  
            if(photos.length > 0){
              photos.forEach((elem) => {
                if(elem.photoDB != null){
                  result.push({
                    originalName: elem.photoDB.originalName,
                    url: elem.Url
                  })
                }
              })
            }
            if(result.length > 0){
              response.data.message = "Success"
              response.data.response = result
            }else{
              response.data.message = "Not found any photo's details in DB!"
              response.data.response = result
            }
          }else{
            response.data.message = "PreSigned URL not Found!!"
          }
        }else{
          response.data.message = "No Matched Found!!"
        }
      }else{
        response.status = false;
        response.data.message = "Event not Found!"
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