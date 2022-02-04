export interface IOption {
    _id: string;
    option: string;
    isCorrect: boolean;
}

export interface IChildren {
    _id: string;
    question: string;
    options: IOption[];
    additionalInfo?: string;
}

export interface IQuestion {
    _id: string;
    subject: string;
    answer: string;
    options: string;
    questionType: string;
    question: string;
    options_next?: IOption[];
    additionalInfo?: string;
    children?:IChildren[];
}


export interface INormalContent {
    status: boolean,
    question: IQuestion,
    attempted_options: {
        optionID: String
    }[]
}

export interface IComprehensionChild {
    status: boolean,
    question: string,
    attempted_options: {
        optionID: String
    }[]
}

// for comprehension
export interface IComprehensionContent {
    children: IComprehensionChild[]
}

// for a normal paper
export interface IOldversionContent {
    attempted_option: string;
}

export type InternalContentType = INormalContent & IComprehensionContent & IOldversionContent

export interface IContent {
    _id: string,
    questionType: "normal" | "comprehension" | "oldversion";
    content: InternalContentType
} 

export interface ILibPaperQuestions {
    score: {
        passed: number,
        total: number
    },
    _id: string,
    userID: string,
    grade: string,
    subject: string,
    content: IContent[],
}