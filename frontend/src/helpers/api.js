import api from './axios_helper';

export const apiRegister = (data) => api.post('/auth/register', data);
export const apiLogin = (data) => api.post('/auth/login', data);
export const apiGetMe = () => api.get('/auth/me');
export const apiListUsers = () => api.get('/auth/users');

export const apiCreateDocument = (data) => api.post('/documents', data);
export const apiGetDocument = (id) => api.get(`/documents/${id}`);
export const apiListOwned = () => api.get('/documents/owned');
export const apiListShared = () => api.get('/documents/shared');
export const apiUpdateDocument = (id, data) => api.patch(`/documents/${id}`, data);
export const apiDeleteDocument = (id) => api.delete(`/documents/${id}`);

export const apiUploadFile = (formData) =>
  api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const apiShareDocument = (docId, data) =>
  api.post(`/documents/${docId}/share`, data);
export const apiGetShares = (docId) => api.get(`/documents/${docId}/shares`);
export const apiRemoveShare = (docId, shareId) =>
  api.delete(`/documents/${docId}/shares/${shareId}`);
