class ResponseTexts {
    ResID: number;
    ResponseID: number;
    ResponseText: string | undefined;
    RName : string | undefined;
    constructor(
        ResID: number,
        ResponseID: number,
        ResponseText: string,
        RName: string,
    ) 
    {
        this.ResID = ResID;
        this.ResponseID = ResponseID;
        this.ResponseText = ResponseText;
        this.RName = RName;
    }
}

export default ResponseTexts;