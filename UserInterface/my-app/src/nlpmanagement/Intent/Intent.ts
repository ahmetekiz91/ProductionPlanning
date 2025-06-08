class Intent {
    ID: number;
    IntentName: string | undefined;

    constructor(
        ID: number,
        IntentName: string,
    ) {
        this.ID = ID;
        this.IntentName = IntentName;
    }
}

export default Intent;
