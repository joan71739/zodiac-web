import api from './axiosConfig'

// 下載輔助函式
const downloadJson = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

// 匯出所有客戶列表
export const exportClients = async () => {
    const res = await api.get('/export/clients')
    downloadJson(res.data, 'export_clients.json')
}

// 匯出單一客戶命盤資料
export const exportChart = async (clientId) => {
    const res = await api.get(`/export/clients/${clientId}/chart`)
    downloadJson(res.data, `export_chart_${clientId}.json`)
}

// 匯出單一客戶解析
export const exportNotes = async (clientId) => {
    const res = await api.get(`/export/clients/${clientId}/notes`)
    downloadJson(res.data, `export_notes_${clientId}.json`)
}

// 匯出單一客戶諮詢記錄
export const exportLogs = async (clientId) => {
    const res = await api.get(`/export/clients/${clientId}/logs`)
    downloadJson(res.data, `export_logs_${clientId}.json`)
}

// 匯出篩選結果
export const exportSearch = async (params) => {
    const res = await api.get('/export/search', { params })
    downloadJson(res.data, 'export_search.json')
}
