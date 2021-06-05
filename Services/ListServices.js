import http from "../http-common"
const listEndpoint = "/lists"

const getAll = () => {
    return http.get(listEndpoint)
}

const get = id => {
    return http.get(`${listEndpoint}/${id}`)
}

const create = data => {
    return http.post(`${listEndpoint}/`, data)
}

const update = (id, data) => {
    return http.put(`${listEndpoint}/${id}`, data)
}

const remove = id => {
    return http.delete(`${listEndpoint}/${id}`)
}

export default {
    getAll,
    get,
    create,
    update, 
    remove
} 