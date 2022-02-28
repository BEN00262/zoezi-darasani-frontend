import { useEffect, useMemo } from 'react';
import { INormalContent } from '../../special_paper_display/interfaces/librarypaper';
import { IChildren, IOption } from '../../special_paper_display/rendering_engine/DataLoaderInterface';

const CheckBoxComp = ({option, index, position,isMultiAnswersQuestion}: {
    option: IOption
    index: number
    keyValue: string
    position: number
    isMultiAnswersQuestion: boolean,
}) => {
    return (
        <div key={index}>
            <p>
                <label>
                    <input type="checkbox" checked={option.isCorrect} className="filled-in" disabled={true} 
                        required  name={`sub_option_answer_${position}`}/>
                    <span className={option.isCorrect ? "green-text" : "black-text"}>
                        <b>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: option.option
                                }}
                            ></span>
                        </b>
                    </span>
                </label>
            </p>
        </div>
    );
}

const OptionComp = ({option,keyValue,position, isMultiAnswersQuestion}: {
    option: IOption,
    keyValue: string,
    position: number,
    isMultiAnswersQuestion: boolean,
}) => {
    return (
            <p key={keyValue}>
                <label>
                    <input disabled={true} checked={option.isCorrect} required 
                    className="with-gap"
                        type="radio"
                        name={`sub_option_answer_${position}`}
                    />
                    <span className={option.isCorrect ? "green-text" : "black-text"}>
                        <b>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: option.option
                                }}
                            ></span>
                        </b>
                    </span>
                </label>
            </p>
    )
}

const MultiAnswerComp = ({ children, index }: {
    children: any,
    index: number,
}) => {
    return (
        <div style={{
            marginLeft:"15px",
            marginTop:"5px",
            marginBottom:"5px",
            display:"flex",
            flexDirection:"row",
        }}>
            {index+1}.
            <div>
                { children }
            </div>
        </div>
    );
}

const NonMultiAnswerComp = ({ children }: {
    children: any,
    index: number
}) => {
    return (
        <div style={{
            marginLeft:"15px",
            marginTop:"5px",
            marginBottom:"5px",
        }}>
            { children }
        </div>
    );
}


// get the sub question stuff :)
const SubQuestionComp = ({
    question, index,  savedState, parentId
}:{
    question: IChildren,
    parentId: string
    index: number,
    savedState: INormalContent | null,
}) => {
    useEffect(() => {
       
    }, []);

    const isMultipleOption = useMemo(() => question?.options?.filter(x => x.isCorrect)?.length > 1,[question]);
    const isMultiAnswersQuestion: boolean = question.question.trim().replace(/(<([^>]+)>)/ig, "").trim().length <= 1;

    const RenderQuestion = isMultiAnswersQuestion ? MultiAnswerComp : NonMultiAnswerComp;

    const ChooseRenderingOption = () => {
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index, option,quesIndex }:{
            position: number
            index: number
            option: IOption
            quesIndex: number
        }) => {
            return <Renderer
                    keyValue={`sub_option_${index}_${quesIndex}`}
                    isMultiAnswersQuestion={isMultiAnswersQuestion}
                    key={`sub_option_${index}_${quesIndex}`} 
                    position={position} 
                    option={option} 
                    index={index}
            />
        }
    }

    const chooseRenderingOption = ChooseRenderingOption();
    // we take the index of the question and thats it
    // const checkIfWasSelected = (optionID: string) => !!suggestedAnswer.find(x => (x._id === optionID) || 0);

    return (
        <div style={{
            marginLeft:"6px"
        }}>
            <span
                dangerouslySetInnerHTML={{
                    __html: !isMultiAnswersQuestion ? `
                        <div style="display:flex;flex-direction:row;">
                            <p style="margin-right:5px;">
                                ${index+1}.  
                            </p>
                            <p><strong>
                            ${question.question}
                            </strong></p>
                        </div>
                    ` : ""
                }}
            ></span>

            <RenderQuestion index={index}>
                {
                    question.options.map((option,quesIndex) => {
                            return chooseRenderingOption({
                                position:index,
                                index,
                                quesIndex,
                                option,
                            })
                    })
                }
            </RenderQuestion>

            <div style={{
                marginLeft:"15px",
                marginBottom: "10px"
            }}>
                <span
                    dangerouslySetInnerHTML={{
                        __html: `
                        <blockquote class="red lighten-5">
                            <span>
                                ${question.additionalInfo}
                            </span>
                        </blockquote>
                    `}}
                ></span>
            </div>
        </div>
    )
}

export default SubQuestionComp;