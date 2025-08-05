const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/?retryWrites=true&w=majority&appName=devops', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Appointment Service - MongoDB connected'))
  .catch(err => console.error('Appointment Service - MongoDB connection error:', err));

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  doctor: { type: String },
  reason: { type: String },
  status: { type: String, default: 'Scheduled' },
  notes: { type: String },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.get('/', (req, res) => {
  res.json({ message: 'Appointment Service is running!' });
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

app.post('/api/appointments', async (req, res) => {
  const {
    patientName,
    patientId,
    date,
    time,
    doctor,
    reason,
    status,
    notes
  } = req.body;
  
  try {
    const appointment = new Appointment({
      patientName,
      patientId,
      date,
      time,
      doctor,
      reason,
      status,
      notes
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Error creating appointment', error });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating appointment', error });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting appointment', error });
  }
});

app.listen(PORT, () => {
  console.log(`Appointment Service is running on http://localhost:${PORT}`);
});