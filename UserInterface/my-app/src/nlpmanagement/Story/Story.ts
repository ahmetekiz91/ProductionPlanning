class Story {
    StoryID: number;
    StoryName: string | undefined;
    constructor(
        StoryID: number,
        StoryName: string,
    ) 
    {
        this.StoryID = StoryID;
        this.StoryName = StoryName;
    }
}
export default Story;