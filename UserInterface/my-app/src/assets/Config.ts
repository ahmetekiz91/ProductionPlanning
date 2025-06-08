export class Config
{

    APIURL: string;
    nlpapiurl:string;
    //DOTNETURL:string;
    constructor() 
    {
         this.APIURL = "https://localhost:7112/api/";
       //this.APIURL="http://localhost:5197/api/";
        this.nlpapiurl = "http://localhost:9000";
        //this.DOTNETURL="https://localhost:7112/api/";
    }
}

export default Config;