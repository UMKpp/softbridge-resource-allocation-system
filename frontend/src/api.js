import axios from "axios";
import { authHeader } from "./auth";

export const api = axios.create({
    baseURL: "http://localhost:8081"
});

export const authConfig = () => ({
    headers: authHeader()
});
