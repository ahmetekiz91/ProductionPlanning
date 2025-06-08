
import axios from 'axios';
import { ProductionOrder } from '../Models/ProductionOrder';
import Config from '../assets/Config';

const url = new Config();
const API_URL = url.APIURL + 'ProductionOrder';

export const getProductionOrders = async (CAID:any,IsCompleted:any) => {
  return axios.get<ProductionOrder[]>(API_URL+(CAID==undefined?'?CAID=':"?CAID="+CAID )+"&IsCompleted="+IsCompleted);
};

export const createProductionOrder = async (productionorder: ProductionOrder): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(API_URL, productionorder);
    return response.data; // Return the boolean indicating success
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log Axios-specific errors
      console.error(
        "Axios error:",
        `Status: ${error.response?.status || "Unknown"}, Message: ${error.response?.data || error.message}`
      );
      // Throw a meaningful error
    
      console.error("Failed to create the production order", error.response?.data);
      return false;
    } else {
      // Log other unexpected errors
      console.error("Unexpected error:", error);
      return false;
    }
  }
};

export const updateProductionOrder = async (id: number, productionorder: ProductionOrder) : Promise<boolean> => {
  try {
    const response = await axios.put<boolean>(`${API_URL}/${id}`, productionorder);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) 
      {
      console.error(
        "Axios error:",
        `Status: ${error.response?.status || "Unknown"}, Message: ${error.response?.data || error.message}`
      );
      console.error("Failed to create the production order", error.response?.data);
      return false;
    } else {
      console.error("Unexpected error:", error);
      return false;
    }
  }
};

export const deleteProductionOrder = async (id: number) => {
  return axios.delete<ProductionOrder>(`${API_URL}/${id}`);
};
