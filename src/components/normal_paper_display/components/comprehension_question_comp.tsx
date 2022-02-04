import { useEffect } from 'react';
// @ts-ignore
import M from 'materialize-css';

import SubQuestionComp from './sub_question_comp';
import { InternalContentType } from '../interface/ILibPaper';

const ComprehensionComp = ({content}:{
    content: InternalContentType,
}) => {
    useEffect(() => {
        let elems = document.querySelectorAll(".question-comp img");
        M.Materialbox.init(elems);
    },[]);

    return (
        <div>
            <span
                dangerouslySetInnerHTML={{
                    __html: `<div class="question-comp">${content.question.question}</div>`
                }}
            ></span>
            <div style={{
                marginTop:"5px"
            }}>
                {
                    content.question.children?.map((child,index) => {
                        let subQuestionData = content.children.find(x => x.question === child._id);

                        if (!subQuestionData){
                            return null
                        }

                        return <SubQuestionComp 
                            key={index} 
                            content={child} 
                            index={index}
                            subQuestionData={subQuestionData}
                        />
                    })
                }
            </div>
        </div>
    )
}

export default ComprehensionComp;