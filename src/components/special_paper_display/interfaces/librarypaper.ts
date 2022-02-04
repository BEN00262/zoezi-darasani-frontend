// create a simple enum to illustrate the point --> later export it
// think about the old version questions and the comprehension questions too

export interface INormalContent {
    status: boolean,
    question: string,
    attempted_options: {
        optionID: string,
        optionIndex: number
    }[]
}

// for comprehension
export interface IComprehensionContent {
    question: string;
    // attempted_options?: null;
    children: INormalContent[]
}

// for a normal paper | wdgf
export interface IOldversionContent {
    status: boolean,
    question: String,
    attempted_option: string;
}

export interface ILibraryPaperContent {
    // status: boolean,
    // question: String,
    questionType?:"normal" | "comprehension" | "oldversion";
    content: INormalContent | IComprehensionContent | IOldversionContent
}

// paper
export interface IPagePaperStudentTree {
    // this is a simple stuff
    subject: string,
    score: {
        passed: number,
        total: number
    },

    // store the pages in the pages --> find a way to submit this tree
    // push the page that we are in then do other stuff
    pages: {
        [key:number]: ILibraryPaperContent[]
    }
}

export interface ILibraryPaper {
    grade: String,
    subject: String,
    score: {
        passed: number,
        total: number
    },
    content: ILibraryPaperContent[]
}