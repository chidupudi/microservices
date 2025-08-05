const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const SERVICES = {
  USER: process.env.USER_SERVICE_URL || 'http://user-service:5001',
  APPOINTMENT: process.env.APPOINTMENT_SERVICE_URL || 'http://appointment-service:5002',
  MEDICAL_RECORDS: process.env.MEDICAL_RECORDS_SERVICE_URL || 'http://medical-records-service:5003',
  BILLING: process.env.BILLING_SERVICE_URL || 'http://billing-service:5004'
};

const forwardRequest = async (req, res, serviceUrl) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}${req.path}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Service unavailable', error: error.message });
    }
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'Healthcare API Gateway is running!' });
});

app.all('/api/signup', (req, res) => forwardRequest(req, res, SERVICES.USER));
app.all('/api/login', (req, res) => forwardRequest(req, res, SERVICES.USER));
app.all('/api/users', (req, res) => forwardRequest(req, res, SERVICES.USER));

app.all('/api/appointments*', (req, res) => forwardRequest(req, res, SERVICES.APPOINTMENT));

app.all('/api/records*', (req, res) => forwardRequest(req, res, SERVICES.MEDICAL_RECORDS));

app.all('/api/billings*', (req, res) => forwardRequest(req, res, SERVICES.BILLING));

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
  console.log('Service mappings:');
  console.log(`- User Service: ${SERVICES.USER}`);
  console.log(`- Appointment Service: ${SERVICES.APPOINTMENT}`);
  console.log(`- Medical Records Service: ${SERVICES.MEDICAL_RECORDS}`);
  console.log(`- Billing Service: ${SERVICES.BILLING}`);
});