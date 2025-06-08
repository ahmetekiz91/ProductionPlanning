class StoryDetay {
    ID: number;
    IntentID?: number | null;
    IName: string | undefined;
    ResponseID?: number | null;
    RName: string | undefined;
    SlotID?: number | null;
    SName: string | undefined;
    FormID?: number | null;
    FName: string | undefined;
    StoryID: number;
    StoryName: string | undefined;
    VariableType: string | undefined; // char(1) in SQL, string in TypeScript
    LineNumber: number | undefined;

    constructor(
        ID: number,
        StoryID: number,
        StoryName?: string,
        IntentID?: number|null,
        IName?: string,
        ResponseID?: number|null,
        RName?: string,
        SlotID?: number|null,
        SName?: string,
        FormID?: number,
        FName?: string,
        VariableType?: string,
        LineNumber?: number
    ) {
        this.ID = ID;
        this.IntentID = IntentID === 0 ? null : IntentID;
        this.FName = FName;
        this.StoryName = StoryName;
        this.SName = SName;
        this.ResponseID =  ResponseID === 0 ? null : ResponseID;
        this.SlotID =  SlotID === 0 ? null : SlotID;
        this.FormID =  FormID === 0 ? null : FormID;
        this.StoryID = StoryID ;
        this.VariableType = VariableType;
        this.LineNumber = LineNumber;
        this.IName = IName;
        this.RName = RName;
    }
}

export default StoryDetay;