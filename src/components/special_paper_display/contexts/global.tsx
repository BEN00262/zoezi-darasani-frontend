import { createContext, useReducer } from "react";
import { IPaperMap } from "../grouper/grouper";
import { ILibraryPaperContent, IPagePaperStudentTree } from "../interfaces/librarypaper";
import { IQuestion } from "../rendering_engine/DataLoaderInterface";
import { INITIALIZE_ATTEMPT_TREE_AT, UPDATE_ATTEMPT_TREE, UPDATE_ATTEMPT_TREE_AT, UPDATE_ATTEMPT_TREE_AT_AND_MOVE, UPDATE_COMP_SUB_PAGE, UPDATE_CONGRATS_POP_UP_STATE, UPDATE_CURRENT_PAGE_NUMBER, UPDATE_DOING_STATE, UPDATE_ISMARKED, UPDATE_NO_OF_QUES_PER_PAGE, UPDATE_QUESTIONS, UPDATE_SUBJECT_NAME, UPDATE_TIME_REMAINING, UPDATE_TOTAL_MARKS } from "./actionType";
import reducer from "./reducer";

// reset each time a paper is loaded into the system
// if we have a comprehension question the fetch should be different
// check if the paper is timed

export interface IState {
    questions: IQuestion[]
    isLibraryPaper: boolean
    paperMap: IPaperMap
    paperHistoryID: string
    paperID: string
    questionsAttempted: number
    numOfQuestions: number
    compSubQuestionPage: number
    isMarked: boolean
    isCongratsOpened: boolean
    isTimed: boolean
    remainingTime: number // used for timed papers
    attemptTree: IPagePaperStudentTree
    gradeName: string
    subject: string
    currentPage: number
    nextPage: number
    totalPages: number // total page counts --> used for some ui shit
    questionsPerPage: number
}

const initialState: IState = {
    questions: [],
    isLibraryPaper: false,
    isCongratsOpened: false,
    questionsAttempted: 0,
    paperHistoryID: "",
    remainingTime: 0,
    paperID: "",
    compSubQuestionPage: 0, // only used for comprehension questions
    paperMap: { pages:{} },
    attemptTree: {
        pages: {},
        score: {passed:0, total:0},
        subject: ""
    },
    isMarked: false,
    isTimed: false,
    gradeName: "",
    subject: "",
    numOfQuestions: 0,
    currentPage: 0, // this should be persisted somewhere
    nextPage: 1,
    totalPages: 0,
    // this does not change at all its preconfigured
    // be smart on the fetching stuff
    questionsPerPage: 1
}

export const GlobalContext = createContext<IState>(initialState)

const GlobalContextComp = ({ children }: any) => {
    const [reducer_state, dispatch] = useReducer(reducer, initialState)

    // a simple function to update questions
    const updateQuestions = ({questions, isLibraryPaper, paperID,gradeName, isMarked, paperHistoryID,isTimed, remainingTime, compSubQuestionPage, paperMap, currentPage, totalPages, numOfQuestions, attemptTree}:{
        questions: IQuestion[],
        paperMap: IPaperMap,
        currentPage: number,
        totalPages: number,
        isMarked: boolean,
        paperID: string,
        compSubQuestionPage: number,
        numOfQuestions: number,
        attemptTree: IPagePaperStudentTree,
        isTimed: boolean,
        remainingTime: number,
        paperHistoryID: string,
        gradeName: string,
        isLibraryPaper: boolean
    }) => {
        dispatch({
            type: UPDATE_QUESTIONS,
            payload: {
                questions,
                isLibraryPaper,
                compSubQuestionPage,
                paperHistoryID,
                gradeName,
                paperID,
                paperMap,
                isTimed,
                remainingTime,
                currentPage,
                isMarked,
                totalPages,
                numOfQuestions,
                attemptTree
            }
        })
    }


    // update the tree
    // run a preinitialize on every question ( then further customize the data pushing process )
    const updateAttemptTree = (page: number, content: ILibraryPaperContent[]) => {
        dispatch({
            type: UPDATE_ATTEMPT_TREE,
            payload: {
                page,
                content
            }
        })
    }

    const initializeStudentTreeContentAt = (page: number, content: ILibraryPaperContent) => {
        dispatch({
            type: INITIALIZE_ATTEMPT_TREE_AT,
            payload: {
                page,
                content
            }
        })
    }

    const updateStudentTreeContentAt = (page: number, parent_question_id: string, content: ILibraryPaperContent) => {
        // we use this to update on the specific tree content
        dispatch({
            type: UPDATE_ATTEMPT_TREE_AT,
            payload: {
                parent_question_id,
                page,
                content
            }
        })
    }

    // update the whole page worth of contents --> do two things at the same time :)
    const updateStudentTreeContentAtAndMove = (next_page:number,next_sub_page: number, page: number, contents: ILibraryPaperContent[]) => {
        dispatch({
            type: UPDATE_ATTEMPT_TREE_AT_AND_MOVE,
            payload: {
                page,
                contents,
                next_page,
                next_sub_page
            }
        })
    }

    const updateNoQuesPerPage = (howMany: number) => {
        dispatch({
            type: UPDATE_NO_OF_QUES_PER_PAGE,
            payload: howMany
        })
    }

    const setSubjectName = (subject: string) => {
        dispatch({
            type: UPDATE_SUBJECT_NAME,
            payload: subject
        })
    }

    const setDoingMode = (status: boolean) => {
        dispatch({
            type: UPDATE_DOING_STATE,
            payload: status
        })
    }

    // this just changes it to true
    const setIsMarked = () => {
        dispatch({
            type: UPDATE_ISMARKED
        })
    }

    const setCurrentSubPage = (pageNum: number) => {
        dispatch({
            type: UPDATE_COMP_SUB_PAGE,
            payload: pageNum
        })
    }

    const updateTotalScore = (score: number) => {
        dispatch({
            type: UPDATE_TOTAL_MARKS,
            payload: score
        })
    }

    const updatePageNumber = (currentPage: number) => {
        dispatch({
            type: UPDATE_CURRENT_PAGE_NUMBER,
            payload: currentPage
        })
    }

    const updateRemainingTime = (time: number) => {
        dispatch({
            type: UPDATE_TIME_REMAINING,
            payload: time
        })
    }

    const switchCongratsOff = (status: boolean = false) => {
        dispatch({
            type: UPDATE_CONGRATS_POP_UP_STATE,
            payload: status
        })
    }


    return (
        <GlobalContext.Provider value={{
            ...reducer_state,

            // @ts-ignore
            updateQuestions,

            // @ts-ignore
            setSubjectName,

            // @ts-ignore
            updatePageNumber,

            // @ts-ignore
            updateAttemptTree,

            // @ts-ignore
            setIsMarked, setDoingMode, setCurrentSubPage, updateNoQuesPerPage,  updateTotalScore, updateRemainingTime, switchCongratsOff,
            
            // @ts-ignore
            initializeStudentTreeContentAt, updateStudentTreeContentAt, updateStudentTreeContentAtAndMove
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextComp
