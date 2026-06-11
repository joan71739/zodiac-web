import api from './axiosConfig'

// ── 元素解析 CRUD ──────────────────────────────────────
// signKey   必填
// planetKey 選填（null = 純星座解析）
// houseKey  選填（null = 星座特性頁籤）

export const getElementNotes = (signKey, planetKey, houseKey) =>
    api.get('/element-notes', {
        params: {
            signKey,
            ...(planetKey !== undefined && planetKey !== null && { planetKey }),
            ...(houseKey  !== undefined && houseKey  !== null && { houseKey }),
        }
    })

export const createElementNote = (signKey, planetKey, houseKey, data) =>
    api.post('/element-notes', data, {
        params: {
            signKey,
            ...(planetKey !== undefined && planetKey !== null && { planetKey }),
            ...(houseKey  !== undefined && houseKey  !== null && { houseKey }),
        }
    })

export const updateElementNote = (id, data) =>
    api.put(`/element-notes/${id}`, data)

export const deleteElementNote = (id) =>
    api.delete(`/element-notes/${id}`)
