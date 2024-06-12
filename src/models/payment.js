const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  status: { type: String, required: true },
  transactionId: { type: String, required: true }
},
{
  timestamps: true
}
);


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
paymentSchema.plugin(autoIncrementPlugin);

paymentSchema.index({ paymentDate: 1 }) // Index for the email field

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
