const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
      default: 'admin',
      enum:['admin']
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
adminSchema.plugin(autoIncrementPlugin);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
