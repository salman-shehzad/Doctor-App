# Doctor Hub

Doctor Hub is a full-stack healthcare web application built with React, Express, Node.js, and MongoDB Atlas. Patients can search verified doctors, book appointments, upload payment screenshots, and view medical history and prescriptions. Doctors manage clinics, confirmed appointments, and consultation records. Assistants verify payments. Admin and super admin users manage users, doctor verification, and analytics.

## Tech Stack

- Frontend: React.js with Vite, React Router v6, Tailwind CSS, reusable UI components, Recharts, react-hot-toast
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT with jsonwebtoken, bcryptjs password hashing
- Uploads: Multer and Cloudinary
- Email: Nodemailer for forgot password
- Security: helmet, cors, express-validator, dotenv

## Features

- JWT login and registration for patients and doctors
- Role-based access for patient, doctor, assistant, admin, and super_admin
- Doctor search by name, specialty, disease, and treatment type
- Public doctor profiles with clinic details
- Appointment lifecycle: pending, payment_uploaded, confirmed, cancelled, completed
- Patient payment screenshot upload to Cloudinary
- Assistant payment verification and appointment confirmation
- Doctor medical history and prescription creation
- Immutable medical history and prescription APIs; update and delete are rejected
- Admin stats cards and charts for appointments, treatment types, monthly users, and pending payments
- Super admin user deletion
- Coming soon UI placeholders for AI prediction, video consultation, WhatsApp notifications, and prescription PDF download

## Local Setup

1. Install all root, server, and client dependencies:

```bash
npm install
```

2. Create or update `backend/.env` and `frontend/.env`. MongoDB Atlas is wired in this project; replace placeholder Cloudinary, JWT, and email values before using every backend feature.

3. Start both frontend and backend from one terminal:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`. Backend runs at `http://localhost:5000`.

The root `client` and `server` launchers let `npm run dev` start both apps with `concurrently`.

## Backend Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://doctor_app:<db_password>@cluster0.x5grltx.mongodb.net/doctor_hub?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://hwdwbdnswrnmcddllgjz.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xSy2JHoTGCczLCwPJF3VcQ_PIkPiJsQ
SUPABASE_DATABASE_URL=postgresql://postgres:<db_password>@db.example.supabase.co:5432/postgres
```

The backend connects to MongoDB Atlas through Mongoose.

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

### Doctors

- `GET /api/doctors`
- `GET /api/doctors/me`
- `GET /api/doctors/:id`
- `PUT /api/doctors/:id`

### Clinics

- `GET /api/clinics/:doctorId`
- `POST /api/clinics`
- `PUT /api/clinics/:id`
- `DELETE /api/clinics/:id`

### Appointments

- `POST /api/appointments`
- `GET /api/appointments/patient`
- `GET /api/appointments/doctor`
- `GET /api/appointments/assistant`
- `GET /api/appointments/:id`
- `PATCH /api/appointments/:id/status`

### Payments

- `POST /api/payments`
- `PATCH /api/payments/:id/verify`
- `GET /api/payments/:appointmentId`

### Medical History

- `POST /api/history`
- `GET /api/history/patient`
- `GET /api/history/doctor/:patientId`
- `GET /api/history/:id`
- `PUT/PATCH/DELETE /api/history/:id` return `405`

### Prescriptions

- `POST /api/prescriptions`
- `GET /api/prescriptions/:historyId`
- `PUT/PATCH/DELETE /api/prescriptions/:id` return `405`

### Admin

- `GET /api/admin/users`
- `GET /api/admin/doctors`
- `PATCH /api/admin/doctors/:id/verify`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/stats`

## Database Schema Overview

- `User`: identity, login credentials, role, reset token fields
- `Doctor`: doctor profile, treatment type, fee, verification status
- `Assistant`: assistant user linked to a doctor
- `Clinic`: doctor clinics, address, days, hours
- `Appointment`: patient, doctor, clinic, date, time, workflow status
- `Payment`: appointment payment screenshot and verification status
- `MedicalHistory`: immutable diagnosis, symptoms, notes, linked appointment
- `Prescription`: immutable medicines linked to a medical history record

## Screenshots

Add screenshots here:

- Landing page
- Doctor list
- Doctor profile
- Patient dashboard
- Doctor dashboard
- Assistant dashboard
- Admin analytics
