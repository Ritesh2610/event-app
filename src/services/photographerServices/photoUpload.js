const Event = require('../../models/event');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { RekognitionClient, CreateCollectionCommand, SearchFacesByImageCommand, ListCollectionsCommand, IndexFacesCommand, ListFacesCommand } = require('@aws-sdk/client-rekognition');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const { default: mongoose } = require('mongoose');
const Photos = require('../../models/photo');
const crypto = require('crypto');

const rekognitionClient = new RekognitionClient({
  credentials: {
    accessKeyId: "AKIAU6GDXABA6Q7L2V53",
    secretAccessKey: "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"
  },
  region: "ap-south-1"
});

const s3Client = new S3Client({
  credentials: {
    accessKeyId: "AKIAU6GDXABAWZLBA5UB",
    secretAccessKey: "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"
  },
  region: "ap-south-1"
})


// Function to upload image to S3
const uploadImageToS3 = async (bucketName, key, buffer, mimetype) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mimetype
  };

  try {
  
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
     
    return true;
  } catch (error) {
    console.log("error while uploading image in S3:-", error)
  }
};

// Function to get image from S3
const getPreSignedUrl = async (bucketName, imageKey) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: imageKey
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    return url;
};

const generatePreSignedUrls = async (faces, bucketName) => {
    const facesWithId = faces.filter((elem) => elem.Face.ExternalImageId != undefined)
    const preSignedUrls = await Promise.all(
       facesWithId.map(async (face) => {
        const url = await getPreSignedUrl(bucketName, face.Face.ExternalImageId);
        return {
          FaceId: face.Face.FaceId,
          ExternalImageId: face.Face.ExternalImageId,
          Url: url
        };
      })
    );
    return preSignedUrls;
};


const searchFacesByImage = async (bucketName, key, collectionId, buffer) => {
  try {
    const params = {
      CollectionId: collectionId,
      Image: {
        Bytes: buffer
      }
      // Image: {
      //   S3Object: {
      //     Bucket: bucketName,
      //     Name: key
      //   }
      // }
    };
  
    const command = new SearchFacesByImageCommand(params);
    const response = await rekognitionClient.send(command);
    return response;
    
  } catch (error) {
    console.log("error from searchFacesByImage", error)
  }
};

const indexFaceInCollection = async (bucketName, imageKey, collectionId) => {
  try {
    const command = new IndexFacesCommand({
      CollectionId: collectionId,
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: imageKey
        }
      },
      ExternalImageId: imageKey
    });

    return await rekognitionClient.send(command);
  } catch (error) {
    console.log("error while creating indexFace:-", error)
  }
};

const listFacesInCollection = async (collectionId) => {
  const command = new ListFacesCommand({ CollectionId: collectionId });
  const response = await rekognitionClient.send(command);
  return response;
};

const createCollection = async (collectionId) => {
  try {
    const params = {
      CollectionId: collectionId
    };
  
    const command = new CreateCollectionCommand(params);
    const response = await rekognitionClient.send(command);
    return response.CollectionArn;
    
  } catch (error) {
    console.log("errorrrrrrr", error)
  }
};

const listCollections = async () => {
  const command = new ListCollectionsCommand({});
  try {
    const response = await rekognitionClient.send(command);
    console.log('Collections:', response.CollectionIds);
    return response.CollectionIds;
  } catch (error) {
    console.error('Error listing collections:', error);
    throw error;
  }
};

exports.photoUpload = async (eventId, photographerId, files) => {
    const response = {
        status: false,
        data: {
          message: "",
          response: {}
        }
    }
    
    const bucketName = "my-image-rekognition";
    const collectionId = "image-rekognition";
  
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
        for(const data of files.images){
          // Compress the image using sharp
          const compressedImage = await sharp(data.buffer)
          .resize({ width: 800 }) // Resize to a max width of 800px
          .jpeg({ quality: 100 }) // Compress using JPEG with quality 80
          .toBuffer();
        
          const imageNameForS3Bucket = event.title.split(' ').join('') + "-" + crypto.randomBytes(8).toString('hex') + "-" + data.originalname;
  
          // Upload image to S3
          const s3Res = await uploadImageToS3(bucketName, imageNameForS3Bucket, compressedImage, 'image/jpeg')
  
          if(s3Res){
            // Index face in collection
            await indexFaceInCollection(bucketName, imageNameForS3Bucket, collectionId)
             
            const photoDoc = new Photos({
              userId: event.userId,
              eventId: event._id,
              photographerId: photographerId,
              originalName: data.originalname,
              systemGenratedName: imageNameForS3Bucket
            })
  
            await photoDoc.save();
  
            response.status = true;
            response.data.message = "Success";
          }

        }

      }else{
        response.data.message = "Photographer or Event not Found!"
      }
  

      // console.log(`Compressed size: ${(compressedImage.length / (1024 * 1024)).toFixed(2)} MB`);
  
 
      // List Index faces in collection
      // const indexes = await listFacesInCollection(collectionId);
      // console.log("indexessssss", indexes)
  
      // if(s3Res){
  
      //   // Search faces by image
        // const responses = await searchFacesByImage(bucketName, data.originalname, collectionId, data.buffer)
        
        // const actualRes = await generatePreSignedUrls(responses.FaceMatches, bucketName);
        // console.log("actualRessssss", actualRes);
        // responses.FaceMatches.forEach((elem) => {
        //   console.log(elem.Face)
        // }) 
        // console.log("responsesssssss", )
      // }
     
  
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