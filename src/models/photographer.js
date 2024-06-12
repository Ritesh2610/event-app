const mongoose = require('mongoose');

const photographersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    phone: {
        type: String
    },
    expiryDate: {
        type: Date
    },
    isActive: {
        type: Boolean
    },
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
photographersSchema.plugin(autoIncrementPlugin);

const Photographer = mongoose.model('Photographer', photographersSchema);

module.exports = Photographer;
