class Forms {
    FormID: number;
    FName: string | undefined;

    constructor(
        FormID: number,
        FName: string,
    ) {
        this.FormID = FormID;
        this.FName = FName;
    }
}

export default Forms;