import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import LoaderPage from '../../../_pages/loader';
import LoaderComp from '../../LoaderComp';
import { GlobalContext as LocalContext } from '../contexts/global';
import { generate_paper_map, get_number_of_questions_in_paper, IPaperMap } from '../grouper/grouper';
import { IQuestion, PagedPaper } from '../rendering_engine/DataLoaderInterface';
import HttpClientAxios from '../rendering_engine/HttpClientAxios';
import PaperFetch from '../rendering_engine/PaperFetch';
import QuestionHOC from './QuestionHOC';

// we take the page map and the actual question array
export const initialize_pages_structures = (paperMap: IPaperMap, questions: IQuestion[]) => {
    let pages = {}

    Object.entries(paperMap.pages).forEach(([page, boundaries]) => {
        pages = {
            ...pages,
            [+page]: questions.slice(boundaries.startIndex, boundaries.endIndex).map(question => {

                switch (question.questionType) {
                    case 'comprehension':
                        {
                            return {
                                questionType: "comprehension",
                                content: {
                                    question: question._id,
                                    children: []
                                }
                            }
                        }
                    case 'normal':
                        {
                            return {
                                questionType: "normal",
                                content: {
                                    status: false,
                                    question: question._id,
                                    attempted_options: []
                                }
                            }
                        }
                    default:
                        // i hope we never reach here this nukes everything
                        throw new Error("Invalid question type")
                }
            })
        }
    })

    return pages;
}

export interface IHeadlessComp {
    gradeName: string
    paperID: string
    savedStateID: string
    studentId: string
}

// this is the first thing seen after the paper has been fetched from the db
const HeadlessComp: React.FC<IHeadlessComp> = ({ gradeName, paperID, savedStateID, studentId }) => {
    // @ts-ignore
    const { updateQuestions, setSubjectName } = useContext(LocalContext);
    const { authToken } = useContext(GlobalContext); // now this is the global context

    const [paper, setPaper] = useState<PagedPaper>();
    const [navigate, setNavigate] = useState(false);
    const [error, setError] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // we also need the authToken to be able to fetch stuff
    const BASE_URL = `/api/library/special_paper/${studentId}/${paperID}/${savedStateID}`
    const paperFetch = new PaperFetch(new HttpClientAxios(), BASE_URL);

    useEffect(() => {
        setIsFetching(true);
        paperFetch.getPaper(authToken || "")
            .then(({ paper, prevState }) => {
                setPaper(paper);
                setSubjectName(paper?.subject || "")

                const _paperMap = generate_paper_map(paper?.questions || []);
                const _questions_number = get_number_of_questions_in_paper(paper?.questions || []);

                updateQuestions({
                    questions: paper?.questions || [],
                    paperMap: _paperMap,
                    gradeName,
                    paperID,
                    isLibraryPaper: true,
                    paperHistoryID: prevState._id || "",
                    currentPage: prevState.currentPage || 0,
                    compSubQuestionPage: prevState.compSubQuestionPage || 0,
                    isMarked: prevState.isMarked || false,
                    isTimed: (prevState.isTimed || paper?.isTimed) || false,
                    remainingTime: prevState.remainingTime || 10000,// 0,
                    numOfQuestions: _questions_number,
                    totalPages: Object.keys(_paperMap.pages).length,

                    attemptTree: {
                        subject: paper?.subject || "",
                        score: {
                            passed: prevState?.attemptTree?.score?.passed || 0,
                            total: prevState?.attemptTree?.score?.total || _questions_number
                        },

                        pages: prevState?.attemptTree?.pages || initialize_pages_structures(_paperMap, paper?.questions || [])
                    }
                });
                setNavigate(true);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setIsFetching(false);
            })
    }, []);

    if (isFetching) {
        return (
            <div className="section">
                <LoaderComp/>    
            </div>
        )
    }

    if (error) {
        return (
            <div className="section">
                <div className="row">
                    <div className="col s12">
                        <div className="sub-modal-texts" style={{
                            borderLeft: "2px solid red",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            borderRadius: "3px",
                            lineHeight: "4em",
                            backgroundColor: "rgba(255,0,0, 0.1)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <i className="material-icons left">error_outline</i>
                            <p>{error}</p>
                        </div>
                    </div>
                </div>  
            </div>
        )
    }

    if (navigate) {
        return <QuestionHOC wasTimed={false}/>
    }

    return null;
}

export default HeadlessComp