import { Users } from "../Models/Users";

  export class UsersConverter {
    static convertToUsers(formobject: any): Users {
      const { slots } = formobject;
      if(formobject.slots.Name.value!==null){
        debugger;
        const name = slots.Name ? slots.Name.value : undefined;
        const surname = slots.Surname ?  slots.Surname.value: undefined;
        const phone = slots.Phone ? slots.Phone.value : undefined;
        const username = slots.Username ? slots.Username.value  : undefined;
        const email = slots.Email ? slots.Email.value: undefined;
        const password = slots.Password ?  slots.Password.value : undefined;
        const ID = slots.ID ? slots.ID.value : undefined;
           // Return the Users object
      const user: Users = {
        Id: ID, 
        Name: name,
        Surname: surname,
        Phone: phone,
        Username: username,
        Email: email,
        Password:  password,
        };
       return user;
      }
      
      const user: Users = {
        Id: 0, 
        Name: "",
        Surname: "",
        Phone: "",
        Username: "",
        Email: "",
        Password: ""
      };
   
  
     return user;
    }
  }
  