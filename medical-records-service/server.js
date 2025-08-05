const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5003;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Medical Records Service - MongoDB connected'))
  .catch(err => console.error('Medical Records Service - MongoDB connection error:', err));

const medicalRecordSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String },
  dateOfBirth: { type: String },
  condition: { type: String, required: true },
  treatment: { type: String },
  medications: { type: String },
  notes: { type: String },
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

app.get('/', (req, res) => {
  res.json({ message: 'Medical Records Service is running!' });
});

app.get('/api/records', async (req, res) => {
  try {
    const records = await MedicalRecord.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical records', error });
  }
});

app.post('/api/records', async (req, res) => {
  const {
    patientName,
    patientId,
    dateOfBirth,
    condition,
    treatment,
    medications,
    notes
  } = req.body;
  
  try {
    const record = new MedicalRecord({
      patientName,
      patientId,
      dateOfBirth,
      condition,
      treatment,
      medications,
      notes
    });
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error creating medical record', error });
  }
});

app.get('/api/records/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching medical record', error });
  }
});

app.put('/api/records/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error updating medical record', error });
  }
});

app.delete('/api/records/:id', async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting medical record', error });
  }
});

app.listen(PORT, () => {
  console.log(`Medical Records Service is running on http://localhost:${PORT}`);
});