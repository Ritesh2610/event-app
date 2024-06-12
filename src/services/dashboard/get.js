const { default: mongoose } = require("mongoose");
const Event = require("../../models/event");
const Photos = require("../../models/photo");
const User = require("../../models/user");
const Payment = require("../../models/payment");
const moment = require("moment");

exports.getDashboard = async (auth) => {
  const response = {
    status: false,
    data: {
      message: "User Not Found!!",
      response: {}
    },
  };
  
  try {
    
    if (auth.userType == "admin") {
      let dataObj = {
        totalUsers: 0,
        totalEvents: 0,
        totalPhotos: 0,
        totalActiveUsers: 0,
        totalInActiveUsers: 0,
        totalRevenue: 0
      };
  
      let query = [User.find(), Event.find(), Photos.find(), Payment.aggregate([
        {
          '$match': { status: "Completed"}
        },
        {
          '$group':{
            '_id': null,
            'totalAmount': {'$sum': "$amount"}
          }
        }
      ])];

      const [userDoc, eventDoc, photosDoc, revenueDoc] = await Promise.allSettled(query);

      if (userDoc.value[0] != undefined){
        dataObj.totalUsers = userDoc.value.length;
        
        userDoc.value.forEach(element => {
          if(element.isSubscribed)
            dataObj.totalActiveUsers += 1;

          if(!element.isSubscribed)
            dataObj.totalInActiveUsers += 1;
        });

      }

      if (eventDoc.value[0] != undefined)
        dataObj.totalEvents = eventDoc.value.length;

      if (photosDoc.value[0] != undefined)
        dataObj.totalPhotos = photosDoc.value.length;
      
      if(revenueDoc.value[0] != undefined){
        if(revenueDoc.value[0].totalAmount != undefined)
          dataObj.totalRevenue = revenueDoc.value[0].totalAmount
      }


      response.status = true;
      response.data.message = "Success";
      response.data.response = dataObj;
      
    } else if (auth.userType == "user") {
      let dataObj = {
        totalUsers: 0,
        totalEvents: 0,
        totalPhotos: 0,
      };

      let query = [
        Event.find({ userId: new mongoose.Types.ObjectId(auth.userId) }),
        Photos.find({ userId: new mongoose.Types.ObjectId(auth.userId) }),
      ];

      const [events, photos] = await Promise.allSettled(query);

      if (events.value[0] != undefined)
        dataObj.totalEvents = events.value.length;

      if (photos.value[0] != undefined)
        dataObj.totalPhotos = photos.value.length;

      response.status = true;
      response.data.message = "Success";
      response.data.response = dataObj;
    }
    
    return response;
  } catch (error) {
    console.log(error);
    const response = {
      status: false,
      data: {
        message: error
      }
    };
    return response;
  }
};

exports.getDashboardCurve = async (auth, timestamps, periods) => {
  const response = {
    status: false,
    data: {
      message: "User Not Found!!",
      response: {}
    },
  };
  const timestamp = Number(timestamps);
  const period = Number(periods);
  
  try {

    if (auth.userType == "admin") {
      let dataObj = {
        timestamps: [],
        amount: []
      }

      if(period == 2)
        {
          let dg = new Date(timestamp);
          dg.setMonth(0);
          dg.setDate(1);
          dg.setHours(0);
          dg.setMinutes(0);
          dg.setSeconds(1);
          const GMTDateGT = new Date(dg).toUTCString();
        
          let dt = new Date(timestamp);
          let y = dt.getFullYear();
          dt.setMonth(11);
          let d = new Date(y, 12, 0).getDate();
          dt.setDate(d);
          dt.setHours(23);
          dt.setMinutes(59);
          dt.setSeconds(59);
          const GMTDateLT = new Date(dt).toUTCString();
  
          console.log("GMTDateGTttttttttt", GMTDateGT)
          console.log("GMTDateLTttttttttt", GMTDateLT)
          let query = [
        
            //Plant Analysis
            Payment.aggregate([
              {
                '$match': {
                  'paymentDate': {
                    '$gte': new Date(GMTDateGT), 
                    '$lte': new Date(GMTDateLT)
                  }, 
                  'amount': {
                    '$ne': null
                  }
                }
              },{
                '$project': {
                  'localTimestamp': {"$add": [ "$paymentDate", 19800000 ]},
                  'amount': 1
                }
              }, {
              '$group': {
                  '_id': {
                    'year': {
                      '$year': '$localTimestamp'
                    }, 
                    'month': {
                      '$month': '$localTimestamp'
                    }
                  }, 
                  'amount': {
                    '$sum': '$amount'
                  },
                  'localTimestamp':{
                    '$last': '$localTimestamp'
                  }
                }
              },{
                '$project':{
                  'month': {
                    '$month': "$localTimestamp"
                  },
                  'localTimestamp':1,
                  'amount': 1,
                  '_id': 0
                }
              },{
                '$sort': {
                  'month': 1
                }
              }
            ])
          ];
  
          //Execute Queries
          let [revenueAnalysisMonth] = await Promise.allSettled(query);
  
          if(typeof revenueAnalysisMonth.value != 'undefined')
          {
            for(let i=1, j=0; i<=12; i++)
            {
              if(typeof revenueAnalysisMonth.value[j] != 'undefined')
              {
                if(i == revenueAnalysisMonth.value[j].month)
                {
                  dataObj.timestamps.push(moment(revenueAnalysisMonth.value[j].localTimestamp).format('MMM YYYY'));
                  dataObj.amount.push(revenueAnalysisMonth.value[j].amount);
                  j++;
                }
                else
                {
                  let monthYear = new Date(GMTDateGT);
                  monthYear.setMonth(i-1);
                  dataObj.timestamps.push(moment(monthYear).format('MMM YYYY'));
                  dataObj.amount.push(null);
                }
              }
              else
              {
                let monthYear = new Date(GMTDateGT);
                monthYear.setMonth(i-1);
                dataObj.timestamps.push(moment(monthYear).format('MMM YYYY'));
                dataObj.amount.push(null);
              }   
            }
          }
      }else if(period == 1)
        {
          let dg = new Date(timestamp);
          dg.setDate(1);
          dg.setHours(0);
          dg.setMinutes(0);
          dg.setSeconds(1);
          let GMTDateGT = new Date(dg).toUTCString();
  
          let dt = new Date(timestamp);
          let y = dt.getFullYear();
          let m = dt.getMonth();
          let d = new Date(y, m +1, 0).getDate();
          dt.setDate(d);
          dt.setHours(23);
          dt.setMinutes(59);
          dt.setSeconds(59);
          let GMTDateLT = new Date(dt).toUTCString();
  
          let query = [
          
            //Revenue Analysis
            Payment.aggregate([
              {
                '$match': {
                  'paymentDate': {
                    '$gte': new Date(GMTDateGT), 
                    '$lte': new Date(GMTDateLT)
                  }
                }
              },{
                '$project': {
                  'localTimestamp': {"$add": [ "$paymentDate", 19800000 ]},
                  'amount': 1,
                  'pm2_5': 1,
                  'temperature': 1,
                  'humidity': 1,
                }
              },
              {
                '$group': {
                  '_id': {
                    'year': { '$year': '$localTimestamp' },
                    'month': { '$month': '$localTimestamp' },
                    'dayOfMonth': { '$dayOfMonth': '$localTimestamp' }
                  },
                  'amount': { '$sum': '$amount' }
                }
              },
              {
                '$sort': {
                  '_id.dayOfMonth': 1
                }
              }
            ])
          ];
  
          //Execute Queries
          let [Revenue_Analysis] = await Promise.allSettled(query);
  
          if(typeof Revenue_Analysis.value != 'undefined')
          {
            for(let i=1, j=0; i<=d; i++)
            {
              if(typeof Revenue_Analysis.value[j] != 'undefined')
              {
                if(i == Revenue_Analysis.value[j]._id?.dayOfMonth)
                {  
                  dataObj.timestamps.push(moment({ month: Revenue_Analysis.value[j]._id?.month - 1, date: Revenue_Analysis.value[j]._id?.dayOfMonth }).format('DD MMM'));
                  dataObj.amount.push(Revenue_Analysis.value[j]?.amount != null ? Math.floor(Revenue_Analysis.value[j]?.amount) : null);
  
                  j++;
                }
                else
                {
                  let dateMonth = new Date(GMTDateGT);
                  dateMonth.setDate(i);
                  dataObj.timestamps.push(moment(dateMonth).format('DD MMM'));
                  dataObj.amount.push(null);
                }
              }
              else
              {
                let dateMonth = new Date(GMTDateGT);
                dateMonth.setDate(i);
                dataObj.timestamps.push(moment(dateMonth).format('DD MMM'));
                dataObj.amount.push(null);
              }
            }
          }
      }

      response.status = true;
      response.data.message = "Success";
      response.data.response = dataObj;
    }
    
    return response;
  } catch (error) {
    console.log(error);
    const response = {
      status: false,
      data: {
        message: error
      }
    };
    return response;
  }
};