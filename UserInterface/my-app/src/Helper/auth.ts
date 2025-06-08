// auth.js
import Config from '../assets/Config';
const config=new Config();
const isAuthenticated = async () =>
{
    try 
    {
        const jsonstring = localStorage.getItem('access_token');
        const usr_obj = localStorage.getItem('usr_obj');
        const token = jsonstring ? JSON.parse(jsonstring) : "";
        const response = await fetch(config.APIURL+'/tokenvalidate', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the 'Authorization' header
          },        
        });
    
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);   
        }
    
        const data = await response.json();
        console.log(data);
        //this variable will be set false as soon as possible inşallah
        return true;
      } catch (error) {
         
        console.error('Error:', error);
    return true;
      }
};

const login = (token:any) => {
    // Store token in localStorage upon successful login
    localStorage.setItem('access_token', token);
};

const logout = () => {
    // Remove token from localStorage on logout
    localStorage.removeItem('access_token');
    localStorage.clear();

};

export { isAuthenticated, login, logout };