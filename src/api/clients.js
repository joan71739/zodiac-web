import api from './axiosConfig'

// 取得所有客戶
export const getClients = () => api.get('/clients')

// 取得單一客戶
export const getClient = (id) => api.get(`/clients/${id}`)

// 新增客戶
export const createClient = (data) => api.post('/clients', data)

// 編輯客戶
export const updateClient = (id, data) => api.put(`/clients/${id}`, data)

// 刪除客戶
export const deleteClient = (id) => api.delete(`/clients/${id}`)

// 上傳星盤圖片
export const uploadChartImage = (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`clients/${id}/chart-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// 取得星盤圖片 URL
export const getChartImageUrl = (id) => `/api/clients/${id}/chart-image`