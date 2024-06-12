const express = require('express');
const Plan = require('../models/plan');
const User = require('../models/user');
const Payment = require('../models/payment');

const route = express.Router();

route.post('/pay', async (req, res) => {
    const { userId, planId } = req.body;
  
    try {
      const plan = await Plan.findById(planId);
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const payment = new Payment({
        userId: user._id,
        planId: plan._id,
        amount: plan.price,
        currency: 'USD',
        paymentDate: new Date(),
        status: 'Completed',
        transactionId: `${Math.random() * 100}`
      });
  
      await payment.save();
  
      const update = {
        subscription:{
            planId: plan._id,
            startDate: new Date(),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            photoUsage: 0
          }
      }
  
      await User.updateOne({_id: user._id}, update);
  
      res.json({ message: 'Payment successful and subscription activated', payment, subscription: user.subscription });
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: err.message });
    }
  });
// router.get('/curve', Dashboard.getDashboardController)

module.exports = route;














const router = express.Router();
