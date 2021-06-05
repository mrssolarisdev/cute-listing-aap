import axios from "axios"

// Uses mockAPI's address
export default axios.create({
    baseURL: "https://60a947cb20a641001730703f.mockapi.io/list-app",
    headers: {
        "Content-type": "application/json"
    }
}) 