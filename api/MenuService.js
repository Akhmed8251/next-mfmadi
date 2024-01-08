import axios from "axios";
import { API_URL } from "./config";

export default class MenuService {
    static async getMenu() {
        const response = await axios.get(`${API_URL}/Menu/GetMenu`)
        return response;
    }

    static async getMenuById(menuId) {
        const response = await axios.get(`${API_URL}/Menu/GetMenuById?menuId=${menuId}`)
        return response;
    }

    static async createMenu(menu) {
        const response = await axios.post(`${API_URL}/Menu/CreateMenu`, menu)
        return response;
    }

    static async editMenu(menu) {
        const response = await axios.post(`${API_URL}/Menu/UpdateMenu`, menu)
        return response;
    }

    static async deleteMenu(id) {
        const response = await axios.post(`${API_URL}/Menu/DeleteMenu?id=${id}`)
        return response;
    }
}