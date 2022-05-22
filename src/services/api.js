import axios from "axios";
const instance = axios.create({
    baseURL: "http://45.9.72.97:9005/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});
export default instance;