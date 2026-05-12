import api from './axiosConfig'

// 查看備份歷史
export const getBackupList = () => api.get('/backup/list')

// 手動觸發備份
export const createBackup = () => api.post('/backup')

// 還原備份
export const restoreBackup = (backupId) => api.post('/backup/restore', { backupId })
