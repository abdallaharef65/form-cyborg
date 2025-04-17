/* eslint-disable */
import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const addInstance = axios.create({
  baseURL: baseUrl,
  method: "POST",
});
