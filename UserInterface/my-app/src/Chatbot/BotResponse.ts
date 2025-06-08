export interface BotResponse {
    response: string;
    type: string;
    form_name?: string;
    form_ready: boolean;
    formobject?: any; // Changed to 'any' to hold form data
    slotname?:any;
  }