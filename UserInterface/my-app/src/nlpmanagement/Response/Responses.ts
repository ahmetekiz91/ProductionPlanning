class Responses 
{
    ResponseID: number;
    Text: string | undefined;
    constructor(
        ResponseID: number,
        Text: string,
    ) 
    {
        this.ResponseID = ResponseID;
        this.Text = Text;
    }
}

export default Responses;