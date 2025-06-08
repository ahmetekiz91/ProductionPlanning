
import axios from 'axios';
import { SubMachines } from '../Models/SubMachines';
import Config from '../assets/Config';

const url = new Config();
const API_URL = url.APIURL + 'SubMachines';

export const getSubMachiness = async () => {
  return axios.get<SubMachines[]>(API_URL);
};

export const createSubMachines = async (submachines: SubMachines) => {
  return axios.post<SubMachines>(API_URL, submachines);
};

export const updateSubMachines = async (id: number, submachines: SubMachines) => {
  return axios.put<SubMachines>(`${API_URL}/${id}`, submachines);
};

export const deleteSubMachines = async (id: number) => {
  return axios.delete<SubMachines>(`${API_URL}/${id}`);
};
