import api from './axiosConfig'

// ── 行運解析 CRUD ──────────────────────────────────────
//
// 情境一：行運星 × 相位 × 本命星
//   transitPlanet='Y', aspectType='q', natalPlanet='Q', transitHouse=null
//
// 情境二：行運星 × 過境宮位
//   transitPlanet='Y', aspectType=null, natalPlanet=null, transitHouse=2

const buildParams = (transitPlanet, aspectType, natalPlanet, transitHouse) => ({
    transitPlanet,
    ...(aspectType   != null && { aspectType }),
    ...(natalPlanet  != null && { natalPlanet }),
    ...(transitHouse != null && { transitHouse }),
})

export const getTransitNotes = (transitPlanet, aspectType, natalPlanet, transitHouse) =>
    api.get('/transit-notes', {
        params: buildParams(transitPlanet, aspectType, natalPlanet, transitHouse)
    })

export const createTransitNote = (transitPlanet, aspectType, natalPlanet, transitHouse, data) =>
    api.post('/transit-notes', data, {
        params: buildParams(transitPlanet, aspectType, natalPlanet, transitHouse)
    })

export const updateTransitNote = (id, data) =>
    api.put(`/transit-notes/${id}`, data)

export const deleteTransitNote = (id) =>
    api.delete(`/transit-notes/${id}`)
