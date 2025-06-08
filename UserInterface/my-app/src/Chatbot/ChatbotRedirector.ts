import { useNavigate } from "react-router-dom";
import { Users } from "../Models/Users";
import { UsersConverter } from "../objectomodelconverter/UsersConverter";

import { Items } from "../Models/Items";



export const useChatbotRedirector = () => {
    const navigate = useNavigate();

    const convertrelatedpage = async (data?: any) => {
        if (!data?.formobject?.intent) {
            console.error("Invalid formobject:", data);
            return;
        }

        const intent = data.formobject.intent;
        console.log("Received intent:", intent);

        if (intent.includes("users")) {
            if (intent === "read_all_users") {
                navigate('/users');
            } else {
                const user: Users = UsersConverter.convertToUsers(data.formobject);
                navigate('/users', { state: { user, intent } });
            }
        
        }  
        else {
            console.warn("Unrecognized intent:", intent);
        }
    };

    return { convertrelatedpage };
};
