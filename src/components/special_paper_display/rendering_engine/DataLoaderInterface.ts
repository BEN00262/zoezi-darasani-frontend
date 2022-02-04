import { Observable } from 'rxjs';
import { IPagePaperStudentTree } from '../interfaces/librarypaper';

export interface IOption {
    _id: string;
    option: string;
    isCorrect: boolean;
}

export interface IChildren {
    question: string;
    _id: string;
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

export interface PagedPaper {
    isTimed: boolean
    duration: number
    questions: IQuestion[]
    subject: string
}

export interface IAttemptedPaper {
    _id: string
    isMarked: boolean
    attemptTree: IPagePaperStudentTree
    compSubQuestionPage: number
    currentPage: number
    createdAt?: Date
}

export interface IPrevState {
    _id?: string
    isMarked: boolean
    isTimed?: boolean
    remainingTime?: number
    attemptTree: IPagePaperStudentTree
    compSubQuestionPage: number
    currentPage: number
}

export default interface DataLoaderInterface {
    getQuestions(num: number):Observable<IQuestion[]>;
}