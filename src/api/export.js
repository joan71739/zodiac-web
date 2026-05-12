import api from './axiosConfig'

/**
 * 從 Content-Disposition header 解析檔名
 * header 格式：attachment; filename="export_clients.json"
 * 若 header 不存在則 fallback 到傳入的 fallbackName
 */
const getFilename = (response, fallbackName) => {
    const disposition = response.headers['content-disposition'] || ''
    const match = disposition.match(/filename="?([^"]+)"?/)
    return match ? match[1] : fallbackName
}

/**
 * 通用下載函式
 * 使用 responseType: 'blob' 直接接收後端回傳的 bytes，
 * 再從 Content-Disposition 取得後端定義的 filename 觸發下載，
 * 完全對齊後端 ExportController 的設計。
 */
const downloadBlob = (response, fallbackName) => {
    const filename = getFilename(response, fallbackName)
    const url = URL.createObjectURL(response.data)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

// 匯出所有客戶列表
export const exportClients = async () => {
    const res = await api.get('/export/clients', { responseType: 'blob' })
    downloadBlob(res, 'export_clients.json')
}

// 匯出單一客戶命盤資料（planets + houses + aspects）
export const exportChart = async (clientId) => {
    const res = await api.get(`/export/clients/${clientId}/chart`, { responseType: 'blob' })
    downloadBlob(res, `export_chart_${clientId}.json`)
}

// 匯出單一客戶解析
export const exportNotes = async (clientId) => {
    const res = await api.get(`/export/clients/${clientId}/notes`, { responseType: 'blob' })
    downloadBlob(res, `export_notes_${clientId}.json`)
}

// 匯出單一客戶諮詢記錄
export const exportLogs = async (clientId) => {
    const res = await api.get(`/export/clients/${clientId}/logs`, { responseType: 'blob' })
    downloadBlob(res, `export_logs_${clientId}.json`)
}

// 匯出篩選結果
// params: { planet, sign, degreeFrom?, degreeTo?, house? }
export const exportSearch = async (params) => {
    const res = await api.get('/export/search', { params, responseType: 'blob' })
    downloadBlob(res, 'export_search.json')
}
