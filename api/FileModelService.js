import axios from "axios";
import { API_URL } from "./config";

export default class FileModelService {
    static async createFileModel(creatingFileModel) {
        const response = await axios.post(`${API_URL}/FileModel/CreateFileModel?contentId=${creatingFileModel.get("contentId")}`, creatingFileModel)
        return response;
    }

    static async deleteFileModel(fileModelId) {
        const response = await axios.post(`${API_URL}/FileModel/DeleteFileModel?id=${fileModelId}`)
        return response;
    }
}