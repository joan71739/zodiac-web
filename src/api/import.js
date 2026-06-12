// src/api/import.js
// 元素解析 & 行運解析 匯入 API
// multipart/form-data，key = "file"
// 回傳：{ inserted, updated, skipped }

import api from './axiosConfig'

/**
 * 通用上傳函式
 * @param {string} endpoint - API 路徑（不含 /api 前綴）
 * @param {File}   file     - 使用者選擇的 JSON 檔案
 */
const uploadJson = (endpoint, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

// 匯入元素解析（星座 or 行星×星座，同一支端點，由 JSON 內容決定）
export const importElementNotes = (file) =>
    uploadJson('/import/element-notes', file)

// 匯入行運解析
export const importTransitNotes = (file) =>
    uploadJson('/import/transit-notes', file)
