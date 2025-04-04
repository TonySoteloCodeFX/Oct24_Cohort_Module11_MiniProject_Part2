import axios from "axios";

const API_URL = "http://127.0.0.1:5000/groceries";

export const getGroceries = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getGrocery = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createGrocery = async (grocery) => {
  const response = await axios.post(API_URL, grocery);
  return response.data;
};

export const updateGrocery = async (id, grocery) => {
  const response = await axios.put(`${API_URL}/${id}`, grocery);
  return response.data;
};

export const deleteGrocery = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
