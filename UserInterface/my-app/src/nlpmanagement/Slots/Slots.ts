class Slots {
    SlotID: number;
    SlotName: string | undefined;
    Stype: string | undefined;
    IsRequired: number | undefined;
    InputMessage: string | undefined;
    FormID: number | undefined;
    FName: string | undefined;
    constructor(
        SlotID: number,
        SlotName: string,
        Stype: string,
        IsRequired: number,
        InputMessage: string,
        FormID: number,
        FName: string,
    ) 
    {
        this.SlotID = SlotID;
        this.SlotName = SlotName;
        this.Stype = Stype;
        this.IsRequired = IsRequired;
        this.InputMessage = InputMessage;
        this.FormID = FormID;
        this.FName = FName;
    }
}

export default Slots;