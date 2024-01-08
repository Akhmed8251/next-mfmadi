import axios from "axios";
import { API_URL } from "./config";

export default class ContactsService {
    static async getContacts() {
        const response = await axios.get(`${API_URL}/Contact/GetContacts`)
        return response;
    }

    static async getContactsForLineOnMainPage() {
        const response = await axios.get(`${API_URL}/Contact/GetContactsForLineOnMainPage`)
        return response;
    }

    static async getContactById(contactId) {
        const response = await axios.get(`${API_URL}/Contact/GetContactById?contactId=${contactId}`)
        return response;
    }

    static async createContact(contact) {
        const response = await axios.post(`${API_URL}/Contact/CreateContact`, contact)
        return response;
    }

    static async editContact(contact) {
        const response = await axios.post(`${API_URL}/Contact/UpdateContact`, contact)
        return response;
    }

    static async deleteContact(contactId) {
        const response = await axios.post(`${API_URL}/Contact/DeleteContact?id=${contactId}`)
        return response;
    }
}