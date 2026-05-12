import api from './axiosConfig'

// ── 客戶 CRUD ──────────────────────────────────────────
export const getClients = () => api.get('/clients')
export const getClient = (id) => api.get(`/clients/${id}`)
export const createClient = (data) => api.post('/clients', data)
export const updateClient = (id, data) => api.put(`/clients/${id}`, data)
export const deleteClient = (id) => api.delete(`/clients/${id}`)

// ── 星盤圖片 ───────────────────────────────────────────
export const uploadChartImage = (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/clients/${id}/chart-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}
export const getChartImageUrl = (id) => `/api/clients/${id}/chart-image`

// ── 行星位置 ───────────────────────────────────────────
export const getPlanets = (clientId) => api.get(`/clients/${clientId}/planets`)
export const createPlanets = (clientId, data) => api.post(`/clients/${clientId}/planets`, data)
export const updatePlanet = (clientId, pid, data) => api.put(`/clients/${clientId}/planets/${pid}`, data)

// ── 宮位守護星 ─────────────────────────────────────────
export const getHouses = (clientId) => api.get(`/clients/${clientId}/houses`)
export const createHouses = (clientId, data) => api.post(`/clients/${clientId}/houses`, data)
export const updateHouse = (clientId, hid, data) => api.put(`/clients/${clientId}/houses/${hid}`, data)

// ── 相位 ───────────────────────────────────────────────
export const getAspects = (clientId) => api.get(`/clients/${clientId}/aspects`)
export const createAspect = (clientId, data) => api.post(`/clients/${clientId}/aspects`, data)
export const updateAspect = (clientId, aid, data) => api.put(`/clients/${clientId}/aspects/${aid}`, data)
export const deleteAspect = (clientId, aid) => api.delete(`/clients/${clientId}/aspects/${aid}`)

// ── 我的解析 ───────────────────────────────────────────
export const getNotes = (clientId) => api.get(`/clients/${clientId}/notes`)
export const createNote = (clientId, data) => api.post(`/clients/${clientId}/notes`, data)
export const updateNote = (clientId, nid, data) => api.put(`/clients/${clientId}/notes/${nid}`, data)
export const deleteNote = (clientId, nid) => api.delete(`/clients/${clientId}/notes/${nid}`)

// ── 諮詢記錄 ───────────────────────────────────────────
export const getLogs = (clientId) => api.get(`/clients/${clientId}/logs`)
export const createLog = (clientId, data) => api.post(`/clients/${clientId}/logs`, data)
export const updateLog = (clientId, lid, data) => api.put(`/clients/${clientId}/logs/${lid}`, data)
export const deleteLog = (clientId, lid) => api.delete(`/clients/${clientId}/logs/${lid}`)

// ── 篩選 ───────────────────────────────────────────────
export const searchClients = (params) => api.get('/search', { params })
