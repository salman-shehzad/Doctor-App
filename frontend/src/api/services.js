import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data)
};

export const doctorApi = {
  list: (params) => api.get('/doctors', { params }),
  me: () => api.get('/doctors/me'),
  detail: (id) => api.get(`/doctors/${id}`),
  update: (id, data) => api.put(`/doctors/${id}`, data)
};

export const clinicApi = {
  byDoctor: (doctorId) => api.get(`/clinics/${doctorId}`),
  create: (data) => api.post('/clinics', data),
  update: (id, data) => api.put(`/clinics/${id}`, data),
  remove: (id) => api.delete(`/clinics/${id}`)
};

export const appointmentApi = {
  book: (data) => api.post('/appointments', data),
  patient: () => api.get('/appointments/patient'),
  doctor: () => api.get('/appointments/doctor'),
  assistant: () => api.get('/appointments/assistant'),
  detail: (id) => api.get(`/appointments/${id}`),
  status: (id, status) => api.patch(`/appointments/${id}/status`, { status })
};

export const paymentApi = {
  upload: (formData) => api.post('/payments', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  verify: (id, status) => api.patch(`/payments/${id}/verify`, { status }),
  byAppointment: (appointmentId) => api.get(`/payments/${appointmentId}`)
};

export const historyApi = {
  create: (data) => api.post('/history', data),
  patient: () => api.get('/history/patient'),
  doctorPatient: (patientId) => api.get(`/history/doctor/${patientId}`),
  byAppointment: (appointmentId) => api.get(`/history/appointment/${appointmentId}`),
  detail: (id) => api.get(`/history/${id}`)
};

export const prescriptionApi = {
  create: (data) => api.post('/prescriptions', data),
  byHistory: (historyId) => api.get(`/prescriptions/${historyId}`)
};

export const adminApi = {
  users: () => api.get('/admin/users'),
  doctors: () => api.get('/admin/doctors'),
  verifyDoctor: (id, isVerified) => api.patch(`/admin/doctors/${id}/verify`, { isVerified }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  stats: () => api.get('/admin/stats')
};
