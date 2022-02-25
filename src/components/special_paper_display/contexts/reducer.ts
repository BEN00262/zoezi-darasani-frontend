import { ActionType, INITIALIZE_ATTEMPT_TREE_AT, UPDATE_ATTEMPT_TREE, UPDATE_ATTEMPT_TREE_AT, UPDATE_ATTEMPT_TREE_AT_AND_MOVE, UPDATE_COMP_SUB_PAGE, UPDATE_CONGRATS_POP_UP_STATE, UPDATE_CURRENT_PAGE_NUMBER, UPDATE_DOING_STATE, UPDATE_ISMARKED, UPDATE_NO_OF_QUES_PER_PAGE, UPDATE_QUESTIONS, UPDATE_SUBJECT_NAME, UPDATE_TIME_REMAINING, UPDATE_TOTAL_MARKS } from "./actionType"
import { IState } from "./global"

export interface IAction {
    type: ActionType,
    payload?: any // this can be optional
}

const reducer: (state:IState, action:IAction)=>IState = (state, action) => {
    switch (action.type) {
        case UPDATE_TIME_REMAINING:
            {
                return {
                    ...state,
                    remainingTime: action.payload
                }
            }
        case UPDATE_CONGRATS_POP_UP_STATE:
            {
                return {
                    ...state,
                    isCongratsOpened: action.payload || false
                }
            }
        case UPDATE_QUESTIONS:
            {
                const {
                    questions, paperMap, totalPages, 
                    currentPage, numOfQuestions, attemptTree,
                    isMarked, compSubQuestionPage, isTimed, remainingTime, paperHistoryID, gradeName,
                    paperID, isLibraryPaper,
                } = action.payload;

                return {
                    ...state,
                    questions,
                    paperHistoryID,
                    gradeName,
                    isLibraryPaper,
                    paperID,
                    isMarked,
                    paperMap,
                    compSubQuestionPage,
                    totalPages,
                    isTimed,
                    remainingTime,
                    currentPage,
                    numOfQuestions,
                    attemptTree
                }
            }

        case UPDATE_TOTAL_MARKS:
            {
                return {
                    ...state,
                    attemptTree: {
                        ...state.attemptTree,
                        score: {
                            passed: action.payload,
                            total: state.attemptTree.score.total
                        },
                    }
                }
            }

        case UPDATE_ATTEMPT_TREE_AT_AND_MOVE:
            {
                // check if we are going back or forward
                let currentPage = action.payload.next_page > -Infinity ? action.payload.next_page : state.currentPage;
                // the current page is set ( meaning we assume that )
                let compSubQuestionPage = action.payload.next_sub_page > -Infinity ? action.payload.next_sub_page : 0;
                
                // console.log(currentPage);
                // console.log(compSubQuestionPage);

                // we can update the sub questions while also updating the main page ( to allow for back navigations )
                return {
                    ...state,
                    currentPage,
                    compSubQuestionPage,
                    attemptTree: {
                        ...state.attemptTree,
                        pages: {
                            ...state.attemptTree.pages,
                            [action.payload.page]: action.payload.contents
                        }
                    }
                }
            }
        case UPDATE_ATTEMPT_TREE_AT:
            {
                // i know this is inefficient but i have no time to think :)
                let local_state_copy = { ...state }
                let page = local_state_copy.attemptTree.pages[action.payload.page]

                let foundIndex = page.findIndex(x => x.content.question === action.payload.parent_question_id)

                if (foundIndex < 0) {
                    return state // return the report only
                }

                page[foundIndex] = action.payload.content;

                return {
                    ...state,
                    attemptTree: {
                        ...state.attemptTree,
                        pages: {
                            ...state.attemptTree.pages,
                            [action.payload.page]: page
                        }
                    }
                }
            }
        case INITIALIZE_ATTEMPT_TREE_AT:
            {
                return {
                    ...state,
                    attemptTree: {
                        ...state.attemptTree,
                        pages: {
                            ...state.attemptTree.pages,
                            [action.payload.page]: [
                                ...(state.attemptTree.pages[action.payload.page] || []),
                                action.payload.content
                            ]
                        }
                    }
                }
            }
        case UPDATE_NO_OF_QUES_PER_PAGE:
            {
                return {
                    ...state,
                    questionsPerPage: action.payload || 1
                }
            }
        case UPDATE_COMP_SUB_PAGE:
            {
                return {
                    ...state,
                    compSubQuestionPage: action.payload
                }
            }

        case UPDATE_DOING_STATE:
            {
                return {
                    ...state,
                    isTimed: action.payload
                }
            }

        case UPDATE_ISMARKED:
            {
                return {
                    ...state,
                    isMarked: true
                }
            }
        case UPDATE_ATTEMPT_TREE:
            {
                return {
                    ...state,
                    attemptTree: {
                        ...state.attemptTree,
                        pages: {
                            // @ts-ignore
                            ...state.attemptTree.pages,
                            [action.payload.page]: action.payload.content
                        }
                    }
                }
            }
        case UPDATE_CURRENT_PAGE_NUMBER:
            {
                return {
                    ...state,
                    currentPage: action.payload,
                    compSubQuestionPage: 0 // when moving to another page this should be zero
                }
            }
        case UPDATE_SUBJECT_NAME:
            {
                return {
                    ...state,
                    subject: action.payload
                }
            }
        default:
            return state
    }
}

export default reducer