const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5004;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Billing Service - MongoDB connected'))
  .catch(err => console.error('Billing Service - MongoDB connection error:', err));

const billingSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String },
  serviceType: { type: String },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  insuranceProvider: { type: String },
  insurancePolicyNumber: { type: String },
  billingAddress: { type: String },
});

const Billing = mongoose.model('Billing', billingSchema);

app.get('/', (req, res) => {
  res.json({ message: 'Billing Service is running!' });
});

app.get('/api/billings', async (req, res) => {
  try {
    const billings = await Billing.find();
    res.status(200).json(billings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching billing records', error });
  }
});

app.post('/api/billings', async (req, res) => {
  const {
    patientName,
    patientId,
    serviceType,
    amount,
    paymentMethod,
    insuranceProvider,
    insurancePolicyNumber,
    billingAddress
  } = req.body;
  
  try {
    const billing = new Billing({
      patientName,
      patientId,
      serviceType,
      amount,
      paymentMethod,
      insuranceProvider,
      insurancePolicyNumber,
      billingAddress
    });
    await billing.save();
    res.status(201).json(billing);
  } catch (error) {
    res.status(400).json({ message: 'Error creating billing record', error });
  }
});

app.get('/api/billings/:id', async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }
    res.status(200).json(billing);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching billing record', error });
  }
});

app.put('/api/billings/:id', async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }
    res.status(200).json(billing);
  } catch (error) {
    res.status(400).json({ message: 'Error updating billing record', error });
  }
});

app.delete('/api/billings/:id', async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) {
      return res.status(404).json({ message: 'Billing record not found' });
    }
    res.status(200).json({ message: 'Billing record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting billing record', error });
  }
});

app.listen(PORT, () => {
  console.log(`Billing Service is running on http://localhost:${PORT}`);
});