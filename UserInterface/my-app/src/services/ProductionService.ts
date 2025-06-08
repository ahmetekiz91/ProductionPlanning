
import axios from 'axios';
import { Production } from '../Models/Production';
import Config from '../assets/Config';

const url = new Config();
const API_URL = url.APIURL + 'Production';

export const getProductions = async () => {
  return axios.get<Production[]>(API_URL);
};

export const createProduction = async (production: Production) => {
  return axios.post<Production>(API_URL, production);
};

export const updateProduction = async (id: number, production: Production) => {
  return axios.put<Production>(`${API_URL}/${id}`, production);
};

export const deleteProduction = async (id: number) => {
  return axios.delete<Production>(`${API_URL}/${id}`);
};
