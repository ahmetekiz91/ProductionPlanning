
import axios from 'axios';
import { Items } from '../Models/Items';
import Config from '../assets/Config';

const url = new Config();
const API_URL = url.APIURL + 'Items';

export const getItems = async () => {
  return axios.get<Items[]>(API_URL);
};

export const getItembyFilter = async (params: any):Promise<Items[]> => {
  
  const response = await axios.get<Items[]>(API_URL, {
    params, // Appends query parameters to the URL
  });
  return  response.data
};

export const createItems = async (items: Items) => {
  return axios.post<Items>(API_URL, items);
};

export const updateItems = async (id: number, items: Items) => {
  return axios.put<Items>(`${API_URL}/${id}`, items);
};

export const deleteItems = async (id: number) => {
  return axios.delete<Items>(`${API_URL}/${id}`);
};
