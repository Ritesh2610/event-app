const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      validate: {
          validator: async function(value) {
            const user = await this.constructor.findOne({ username: value });
            return !user;
          },
          message: 'Username already exists!!'
      }
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: async function(value) {
              const user = await this.constructor.findOne({ email: value });
              return !user;
            },
            message: 'Email already exists!!'
        }
    },
    userType: { 
      type: String, 
      default: 'user',
      enum:['user']
    },
    companyName: {
      type: String,
      required: true
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    createdBy:{
      type: String,
      default: "user"
    },
    isSubscribed: {
      type: Boolean,
      default: false
    },
    subscription: {
      planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
      startDate: { type: Date },
      endDate: { type: Date },
      photoUsage: { type: Number, default: 0 }
    }
},
{
  timestamps: true // Add timestamps option
});


// Define the plugin function
function autoIncrementPlugin(schema) {
    schema.add({
      id: {
        type: Number,
        unique: true
      }
    });
  
    schema.pre('save', async function(next) {
      if (!this.id) {
        try {
          const Model = this.constructor;
          const highestDoc = await Model.findOne({}, {}, { sort: { id: -1 } });
          const nextId = highestDoc ? highestDoc.id + 1 : 1;
          this.id = nextId;
          next();
        } catch (err) {
          next(err);
        }
      } else {
        next();
      }
    });
}
  
// Apply the plugin to your schema
usersSchema.plugin(autoIncrementPlugin);
usersSchema.index({ email: 1 }) // Index for the email field

const User = mongoose.model('User', usersSchema);

module.exports = User;
