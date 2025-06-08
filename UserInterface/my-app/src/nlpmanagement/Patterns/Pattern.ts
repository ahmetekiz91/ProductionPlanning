class Pattern {
    ID: number;
    IntentID: number;
    Text: string | undefined;
    IName: string | undefined;

    constructor(
        ID: number,
        IntentID: number,
        Text: string,
        IName: string,
    ) {
        this.ID = ID;
        this.IntentID = IntentID;
        this.Text = Text;
        this.IName= IName;
    }
}

export default Pattern;
