# Healthcare Microservices

This project contains a healthcare application split into microservices architecture.

## Architecture

- **Client** (Port 3000) - React frontend application
- **API Gateway** (Port 8000) - Routes requests to appropriate microservices
- **User Service** (Port 5001) - Handles authentication and user management
- **Appointment Service** (Port 5002) - Manages patient appointments
- **Medical Records Service** (Port 5003) - Handles patient medical records
- **Billing Service** (Port 5004) - Manages billing and payments

## Setup Instructions

1. **Install dependencies for all services:**
   ```bash
   npm run install-all
   ```

2. **Start all services in development mode:**
   ```bash
   npm run dev-all
   ```

3. **Start all services in production mode:**
   ```bash
   npm run start-all
   ```

## Individual Service Commands

### Client
```bash
cd client
npm install
npm start  # Starts on port 3000
```

### API Gateway
```bash
cd api-gateway
npm install
npm start  # Starts on port 8000
```

### User Service
```bash
cd user-service
npm install
npm start  # Starts on port 5001
```

### Appointment Service
```bash
cd appointment-service
npm install
npm start  # Starts on port 5002
```

### Medical Records Service
```bash
cd medical-records-service
npm install
npm start  # Starts on port 5003
```

### Billing Service
```bash
cd billing-service
npm install
npm start  # Starts on port 5004
```

## Database

All services connect to the same MongoDB database:
- Connection: `mongodb+srv://devops:devops@devops.o4ykiod.mongodb.net/`

## API Endpoints

All API calls go through the API Gateway at `http://localhost:8000`:

- **User endpoints:** `/api/signup`, `/api/login`, `/api/users`
- **Appointment endpoints:** `/api/appointments`
- **Medical records endpoints:** `/api/records`
- **Billing endpoints:** `/api/billings`

## Access the Application

Once all services are running, open your browser and go to:
`http://localhost:3000`