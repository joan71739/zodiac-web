import api from './axiosConfig'

// 送出 AI 對話
export const sendAIChat = ({ noteTitle, noteContent, history, userMessage }) =>
    api.post('/ai/chat', { noteTitle, noteContent, history, userMessage })
