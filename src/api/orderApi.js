import axios from "axios";

const API_URL = "http://127.0.0.1:5000/orders";

export const getOrders = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getOrder = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createOrder = async (order) => {
    const response = await axios.post(API_URL, order);
    return response.data;
};

