import axios from "axios";
import { API_URL } from "./config";

export default class ContentService {
    static async getContents() {
        const response = await axios.get(`${API_URL}/Content/GetContents`)
        return response;
    }

    static async getContentById(contentId) {
        const response = await axios.get(`${API_URL}/Content/GetContentById?contentId=${contentId}`)
        return response;
    }

    static async createContent(content) {
        const response = await axios.post(`${API_URL}/Content/CreateContent`, content)
        return response;
    }

    static async editContent(content) {
        const response = await axios.post(`${API_URL}/Content/UpdateContent`, content)
        return response;
    }

    static async deleteContent(contentId) {
        const response = await axios.post(`${API_URL}/Content/DeleteContent?id=${contentId}`)
        return response;
    }
}