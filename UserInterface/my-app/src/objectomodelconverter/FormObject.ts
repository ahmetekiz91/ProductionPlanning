export interface FormObject {
    Surname: any;
    Name: any;
    slots: FormObject;
    formobject: {
      slots: {
        [key: string]: {
          type: string;
          is_required: boolean;
          value: string;
          inputMessage: string;
        };
      };
      greeting: string;
    };
  }