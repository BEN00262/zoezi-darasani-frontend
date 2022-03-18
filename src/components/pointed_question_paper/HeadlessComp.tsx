import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import LoaderComp from '../LoaderComp';
import { GlobalContext as LocalContext } from '../special_paper_display/contexts/global';
import { generate_paper_map, get_number_of_questions_in_paper, IPaperMap } from '../special_paper_display/grouper/grouper';
import { IQuestion, PagedPaper } from '../special_paper_display/rendering_engine/DataLoaderInterface';
import HttpClientAxios from '../special_paper_display/rendering_engine/HttpClientAxios';
import PaperFetch from '../special_paper_display/rendering_engine/PaperFetch';
import QuestionHOC from './QuestionHOC';
import { useRecoilValue } from 'recoil';
import { selectedQuestionAtom, toBeViewedPaperAtom } from '.';
import { initialize_pages_structures } from '../special_paper_display/components/HeadlessComp';


// import this
const findPageWithQuestion = (paperMap: IPaperMap, questionIds: string[], questionId: string): number => {
    
    for (let [page, boundaries] of Object.entries(paperMap.pages)) {
        if (
                questionIds.slice(
                    boundaries.startIndex,
                    boundaries.endIndex
                ).findIndex(x => x === questionId) > -1
            ) 
        {
            return +page;
        }
    }

    return 0; // if it aint present just return the start page :)
}

// this is the first thing seen after the paper has been fetched from the db
const HeadlessComp = () => {
    // @ts-ignore
    const { updateQuestions, setSubjectName } = useContext(LocalContext);
    const { authToken } = useContext(GlobalContext); // now this is the global context

    // to enable the highlighting of the wanted question etc
    const toBeViewedPaperId = useRecoilValue(toBeViewedPaperAtom);
    const selectedQuestionId = useRecoilValue(selectedQuestionAtom);

    const [paper, setPaper] = useState<PagedPaper>();
    const [navigate, setNavigate] = useState(false);
    const [error, setError] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // we also need the authToken to be able to fetch stuff
    const BASE_URL = `/api/deep-analytics/paper/${toBeViewedPaperId}`
    const paperFetch = new PaperFetch(new HttpClientAxios(), BASE_URL);

    useEffect(() => {
       if (toBeViewedPaperId && selectedQuestionId) {
        setIsFetching(true);
        paperFetch.getPaper(authToken || "")
            .then(({ paper, prevState }) => {
                // in this case we really dont care about the prevState just display the paper with questions

                setPaper(paper);
                setSubjectName(paper?.subject || "");

                // compute the page with the chosen question

                const _paperMap = generate_paper_map(paper?.questions || []);
                const _questions_number = get_number_of_questions_in_paper(paper?.questions || []);

                updateQuestions({
                    questions: paper?.questions || [],
                    paperMap: _paperMap,
                    gradeName: paper?.subject, // this is not needed in this case
                    paperID: toBeViewedPaperId,
                    isLibraryPaper: true,
                    paperHistoryID: prevState._id || "",
                    currentPage: findPageWithQuestion(
                        _paperMap,
                        (paper?.questions || [] as IQuestion[]).map(x => x._id).map(x => x),
                        selectedQuestionId
                    ),
                    compSubQuestionPage: prevState.compSubQuestionPage || 0,
                    isMarked: true,
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
       }
    }, [toBeViewedPaperId, selectedQuestionId]);

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