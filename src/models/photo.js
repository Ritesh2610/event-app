const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    photographerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photographer',
        required: true
    },
    permissions: { 
        type: String, 
        enum: ['private', 'public', 'shared'], 
        default: 'private' 
    },
    originalName: { 
        type: String, 
        required: true 
    },
    systemGenratedName: {
        type: String, 
        required: true
    },
    path: {
        type: String,
    },
    folder: {
        type: String,
        default: '/'
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
photoSchema.plugin(autoIncrementPlugin);
photoSchema.index({ event: 1 }); // Index for the event field
photoSchema.index({ userId: 1 }); // Index for the userId field

const Photos = mongoose.model('Photos', photoSchema);

module.exports = Photos;
