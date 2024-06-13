import axios from "axios";

const baseURL = "http://localhost:3333/";

const AxiosService = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

export default AxiosService;
