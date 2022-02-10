import { Card, Button, Container  } from 'react-materialize';
import { useMediaQuery } from 'react-responsive';

import NormalQuestionComp from './normal_question_comp';
import ComprehensionComp from './comprehension_question_comp';
import OldVersionQuestion from './old_version_question';
import { IContent, ILibPaperQuestions } from '../interface/ILibPaper';

const QuestionComp = ({ paper }:{
    paper: ILibPaperQuestions | null
}) => {

    const isTabletOrMobileDevice =  false; /*useMediaQuery({
        query:"(min-width: 601px)"
    });*/

    if (!paper) {
        return (
            <>
                An error occured while fetching the paper
            </>
        )
    }

    const isKiswahili = paper.subject.split(" ")[0].toLowerCase() === "kiswahili";

    const selectQuestionType = (content:IContent,index:number) => {
        switch(content.questionType){
            case 'normal':
                return <NormalQuestionComp
                            key={index} 
                            content={content.content}
                            position={index}
                        />
            case 'comprehension':
                return <ComprehensionComp
                    key={index} 
                    content={content.content}
                />
            default:
                return <OldVersionQuestion
                    key={index} 
                    isKiswahili={isKiswahili}
                    content={content.content}
                    position={index} 
                />
        }
    }


    return (

            <>
                <div className="white" style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent:"space-between",
                    borderRadius:"2px",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    padding:"5px 6px",
                    position:"sticky",
                    top: isTabletOrMobileDevice ? 64.2 : 56.2,
                    zIndex:2,
                }}>
                        <div className="materialize-red white-text" style={{
                            alignSelf:"center",
                            padding:"5px",
                            borderRadius:"3px",
                        }}>
                            <b>
                                <span>
                                    {isKiswahili ? "ALAMA":"SCORE"} : {`${paper.score.passed}/${paper.score.total}`}
                                </span>
                            </b>
                        </div>

                        <div>
                            <button disabled className="waves-effect waves-light z-depth-1 btn-small">{
                                isKiswahili ? "MASWALI ZAIDI" : "MORE QUESTIONS"
                            }</button>
                        </div>
                </div>

                <div id="zoeziPaper">
                    <Card
                        style={{
                            marginTop: "13px"
                        }}

                        header= {
                            <div className="card-image">
                                <div className="postergrad">
                                    <img alt="" style={{
                                        maxWidth:"100%",
                                        height:"84px",
                                        objectFit:"cover",
                                    }} src="/img/background2.webp"/>
                                </div>
                                <span className="card-title text-center sub-names truncate text-bold teal">{
                                    `${paper.subject}`
                                }</span>
                            </div>
                        }
                    >
                        <form onSubmit={(e) => {
                            e.preventDefault();
                        }}>
                            
                            { paper.content.map((content: IContent,index: number) => selectQuestionType(content,index)) }
                            
                            <Button
                                node="button"
                                waves="light"
                                small
                                style={{
                                    marginTop:"15px"
                                }}

                                disabled
                            >
                                { isKiswahili ? "TUMA MAJIBU" : "SUBMIT ANSWERS" }
                            </Button>
                        </form>
                    </Card>
                </div>
            </>
    )
}

export default QuestionComp;