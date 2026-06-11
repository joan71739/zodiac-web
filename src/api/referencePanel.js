import api from './axiosConfig'

// GET /api/clients/{clientId}/reference-panel
export const getReferencePanel = (clientId) =>
    api.get(`/clients/${clientId}/reference-panel`)
