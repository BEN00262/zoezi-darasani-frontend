// we get the array of questions to show then we show them :)
import Pagination from 'rc-pagination';
import { useState } from 'react';
import { ITopFailedPaperAnalytics, ITopFailedPaperQuestion } from "../TopFailedQuestions";
import NormalQuestionComp from "./questions/NormalQuestionComp";
import 'rc-pagination/assets/index.css';


const RenderQuestionTypeComp: React.FC<ITopFailedPaperQuestion & { position: number }> = (analytic) => {
    switch (analytic.question.questionType) {
        case "normal":
            return <NormalQuestionComp {...analytic}/>
        default:
            return null;
    }
}

const FailedQuestionsPaperDisplayComp: React.FC<ITopFailedPaperAnalytics> = ({
    stats
}) => {
    const [currentDisplayPage, setCurrentDisplayPage] = useState(0);

    return (
        <div className="section">
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
            <div className="col s12" style={{
                border: "1px solid #d3d3d3"
            }}>
                {
                    stats.length > currentDisplayPage ? 
                    <RenderQuestionTypeComp {...stats[currentDisplayPage]} position={currentDisplayPage + 1}/>
                    : <p className='center'>No questions found</p>
                }
            </div>
        </div>
    )
}

export default FailedQuestionsPaperDisplayComp