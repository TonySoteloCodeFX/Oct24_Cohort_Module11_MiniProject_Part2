import axios from "axios";

const API_URL = "http://127.0.0.1:5000/users";

export const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getUser = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createUser = async (user) => {
    const response = await axios.post(API_URL, user);
    return response.data;
};

export const updateUser = async (id, user) => {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
