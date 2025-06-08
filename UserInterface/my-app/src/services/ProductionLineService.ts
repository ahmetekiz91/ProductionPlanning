
import axios from 'axios';
import { ProductionLine } from '../Models/ProductionLine';
import Config from '../assets/Config';

const url = new Config();
const API_URL = url.APIURL + 'ProductionLine';

export const getProductionLines = async () => {
  return axios.get<ProductionLine[]>(API_URL);
};

export const createProductionLine = async (ProductionLine: ProductionLine) => {
  return axios.post<ProductionLine>(API_URL, ProductionLine);
};

export const updateProductionLine = async (id: number, ProductionLine: ProductionLine) => {
  return axios.put<ProductionLine>(`${API_URL}/${id}`, ProductionLine);
};

export const deleteProductionLine = async (id: number) => {
  return axios.delete<ProductionLine>(`${API_URL}/${id}`);
};
