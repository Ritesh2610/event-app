const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  planName: { type: String, required: true },
  price: { type: Number, required: true },
  photoLimit: { type: Number, required: true },
  features: [{ type: String, required: true }]
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
planSchema.plugin(autoIncrementPlugin);

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
