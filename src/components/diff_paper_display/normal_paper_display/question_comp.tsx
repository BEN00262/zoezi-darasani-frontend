import { Card  } from 'react-materialize';

import NormalQuestionComp from '../../normal_paper_display/components/normal_question_comp';
import ComprehensionComp from '../../normal_paper_display/components/comprehension_question_comp';
import OldVersionQuestion from '../../normal_paper_display/components/old_version_question';
import { IContent, ILibPaperQuestions } from '../../normal_paper_display/interface/ILibPaper';

const QuestionComp = ({ paper }:{
    paper: ILibPaperQuestions | null
}) => {
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
            <div id="zoeziPaper">
                <Card
                    className='z-depth-0'
                    style={{
                        border: "1px solid #d3d3d3"
                    }}
                    header= {
                        <div className="card-image">
                            <div className="postergrad">
                                <img alt="" style={{
                                    maxWidth:"100%",
                                    height:"84px",
                                    objectFit:"cover",
                                }} src="https://www.zoezi-education.com/img/background2.webp"/>
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
                    </form>
                </Card>
            </div>
        </>
    )
}

export default QuestionComp;