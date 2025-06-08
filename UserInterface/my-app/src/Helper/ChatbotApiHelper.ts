
import { NULL } from 'sass';
import Config from '../assets/Config'; 
const config=new Config();
const jsonstring=localStorage.getItem('access_token');
const token= jsonstring ? JSON.parse(jsonstring) : "";
class ChatbotApiHelper 
{
  
  private baseURL: string;
  public error: Error = new Error("Initial error message");
  
  constructor() {
    this.baseURL = config.nlpapiurl;
  }
  async get(endpoint:string)
  {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token in the 'Authorization' header
          // Add any other necessary headers
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    } catch (error:any) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
  async getwithparams(endpoint: string,  id?: any, where?: any) {
    try {
      // Construct query string from params

      // Fetch request with query parameters
    
      const response = await fetch(`${this.baseURL}/${endpoint}?id=${(id==null?0:id)}&where=${(where==null?'empty' : where)}`, {
        method: 'GET', // Specify method as GET
        headers: {
          'Authorization': `Bearer ${token}`, // Use the correct token
          // Add any other necessary headers, such as Content-Type if required
        },
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      // Return the JSON response
      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
  async getwithheader(endpoint: string) {

    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token in the 'Authorization' header
          // Add any other necessary headers
        },
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    } catch (error:any) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
  async post<T>(endpoint:any, data:any) : Promise<T | null> 
  {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data), // Use your user data here
      });
      if (response.ok) {
       const res: T = await response.json();
       return res;
      } else {
        const data = await response.json();
        // Handle API error
        console.error('Error:', data.error || 'An error occurred');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async patch<T>(endpoint:any, data:any) : Promise<T | null>  
  {
    console.log(`${this.baseURL}/${endpoint}`)
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, 
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const objsi: T = await response.json();
        return objsi;
      } else {
        const errorData = await response.json();
        // Handle API error or log validation errors
        console.error('Error:', errorData.error || 'An error occurred');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  async put(endpoint:any, data:any) {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.json();
    } catch (error:any) {
      throw new Error(`Failed to update data: ${error.message}`);
    }
  }

 async delete(endpoint: any): Promise<boolean> 
  {
    try
     {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return true;
    } catch (error: any) {
      throw new Error(`Failed to delete data: ${error.message}`);
    }
  }

}

export default ChatbotApiHelper;