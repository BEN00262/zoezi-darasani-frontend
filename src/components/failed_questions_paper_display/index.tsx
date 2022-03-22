// we get the array of questions to show then we show them :)
import Pagination from 'rc-pagination';
import { useEffect, useMemo, useState } from 'react';
import { ITopFailedPaperAnalytics, ITopFailedPaperQuestion } from "../TopFailedQuestions";
import NormalQuestionComp from "./questions/NormalQuestionComp";
import 'rc-pagination/assets/index.css';
import ComprehensionQuestionComp from './questions/ComprehensionQuestionComp';
import { atom, useRecoilState } from 'recoil';


const RenderQuestionTypeComp: React.FC<ITopFailedPaperQuestion & { position: number }> = (analytic) => {
    if (!analytic.question) {
        return null;
    }
    
    switch (analytic.question.questionType) {
        case "normal":
            return <NormalQuestionComp {...analytic}/>
        case "comprehension":
            return <ComprehensionQuestionComp {...analytic}/>
        default:
            return null;
    }
}

export const compSubQuestionPageState = atom({
    key: "compSubQuestionPageId",
    default: 0
})

const FailedQuestionsPaperDisplayComp: React.FC<ITopFailedPaperAnalytics> = ({
    stats
}) => {
    const [currentDisplayPage, setCurrentDisplayPage] = useState(0);
    const [reRender, setReRender] = useState(-1);
    const [compSubQuestionPage, setcompSubQuestionPageState] = useRecoilState(compSubQuestionPageState);
    const [currentDisplayQuestion, setCurrentDisplayQuestion] = useState<ITopFailedPaperQuestion>({} as ITopFailedPaperQuestion);

    useEffect(() => {
        if (stats.length) {
            setcompSubQuestionPageState(0); // reset it
            setCurrentDisplayQuestion(stats[currentDisplayPage])
            setReRender(Math.random());
        }
    }, [currentDisplayPage]);

    const pagesPresent = useMemo(() => {
        if (currentDisplayQuestion.question && currentDisplayQuestion.question.questionType === "comprehension") {
            return (Math.floor(
                (currentDisplayQuestion.question ? (currentDisplayQuestion.question.children || []).length : 0) / 5) 
                + ((currentDisplayQuestion.question ? (currentDisplayQuestion.question.children || []).length : 0)%5 > 0 ? 1 : 0))
        }

        return 0;
    }, [currentDisplayQuestion])

    return (
        <div>
            <div className="row">
                <div className="col s12 left-align">
                    {
                        stats.length ?
                            <Pagination
                            onChange={(pageNum, _) => {
                                setCurrentDisplayPage(pageNum - 1);
                            }}
                            current={currentDisplayPage + 1}
                            total={stats.length}
                            pageSize={1}
                        />: null
                    }
                </div>
            </div>

            {/* we check if the current selected question is a comprehension question if so render the navigation */}
           {
               currentDisplayQuestion.question && currentDisplayQuestion.question.questionType === "comprehension" && pagesPresent > 1 ?
                <div style={{
                    border: "1px solid #d3d3d3",
                    marginBottom: "5px",
                    borderRadius:"2px",
                    padding:"5px 6px",
                    position:"sticky",
                    top:  64,
                    zIndex:2,
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}>
                        <button
                            disabled={compSubQuestionPage === 0}
                            className="waves-effect waves-light btn-small z-depth-0"
                            onClick={_ => {
                                // go to the next page ( and fetch the page )
                                setcompSubQuestionPageState(old => old > 0 ? old - 1: old)
                            }}
                        ><i className="material-icons">arrow_back</i></button>
                        <button
                            className="waves-effect waves-light btn-small z-depth-0"
                            disabled={compSubQuestionPage >= pagesPresent-1}
                            onClick={_ => {
                                // go to the next page ( and fetch the page )
                                setcompSubQuestionPageState(old => old + 1)
                            }}
                        ><i className="material-icons">arrow_forward</i></button>
                    </div>
                </div>: null
           }

            <div className="col s12" style={{
                border: "1px solid #d3d3d3"
            }}>
                {
                    stats.length > currentDisplayPage ? 
                    <RenderQuestionTypeComp key={reRender} {...currentDisplayQuestion} position={currentDisplayPage + 1}/>
                    : <p className='center'>No questions found</p>
                }
            </div>
        </div>
    )
}

export default FailedQuestionsPaperDisplayComp