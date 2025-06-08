
import axios from 'axios';
import { Users } from '../Models/Users';
import Config from '../assets/Config';

const url = new Config();
const API_URL = url.APIURL + 'Users';

export const getUsers = async () => {
  return axios.get<Users[]>(API_URL);
};

export const createUsers = async (users: Users) => {
  return axios.post<Users>(API_URL, users);
};

export const updateUsers = async (id: number, users: Users) => {
  return axios.put<Users>(`${API_URL}/${id}`, users);
};

export const deleteUsers = async (id: number) => {
  return axios.delete<Users>(`${API_URL}/${id}`);
};
