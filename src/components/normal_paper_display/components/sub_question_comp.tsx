import { useMemo } from 'react';
import { IComprehensionChild, IOption } from '../interface/ILibPaper';
import { IChildren } from '../interface/ILibPaper';

const CheckBoxComp = ({option,isCorrect, index, position,wasSelected}: {
    option: string,
    isCorrect: boolean,
    wasSelected: boolean,
    index: number,
    position: number,
}) => {
    return (
        <div key={index}>
            <p>
                <label>
                    <input type="checkbox" checked={wasSelected} className="filled-in" disabled required  name={`sub_option_answer_${position}`}/>
                    <span className={isCorrect ? "green-text" : "black-text"}>
                        <b>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: option
                                }}
                            ></span>
                        </b>
                    </span>
                </label>
            </p>
        </div>
    );
}

const OptionComp = ({option,isCorrect, wasSelected,keyValue,position}: {
    option: string,
    isCorrect: boolean,
    keyValue: string,
    wasSelected: boolean,
    position: number,
}) => {
    return (
            <p key={keyValue}>
                <label>
                    <input disabled checked={wasSelected} required className="with-gap"
                        type="radio"
                        name={`sub_option_answer_${position}`}
                    />
                    <span className={isCorrect ? "green-text" : "black-text"}>
                        <b>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: option
                                }}
                            ></span>
                        </b>
                    </span>
                </label>
            </p>
    )
}

const MultiAnswerComp = ({ children, index, isCorrect }: {
    children: any,
    index: number,
    isCorrect: boolean
}) => {
    return (
        <div style={{
            marginLeft:"15px",
            marginTop:"5px",
            marginBottom:"5px",
            display:"flex",
            flexDirection:"row",
        }}>
            {isCorrect ? <span style={{color:"green"}}>&#10004;</span> : <span style={{color:"red"}}>&#10008;</span>}
            {index+1}.
            <div>
                { children }
            </div>
        </div>
    );
}

const NonMultiAnswerComp = ({ children, index }: {
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

const SubQuestionComp = ({content, index, subQuestionData }:{
    content: IChildren,
    index: number,
    subQuestionData: IComprehensionChild
}) => {
    const isMultipleOption = useMemo(() => content.options.filter(x => x.isCorrect)?.length > 1,[content.question])
    const isMultiAnswersQuestion: boolean = useMemo(() => content.question === "",[content.question]);


    const RenderQuestion = isMultiAnswersQuestion ? MultiAnswerComp : NonMultiAnswerComp;

    const ChooseRenderingOption = () => {
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index, option,isCorrect,quesIndex, wasSelected}:{
            position: number,
            index: number,
            option: string,
            isCorrect: boolean,
            wasSelected: boolean,
            quesIndex: number
        }) => {
            return <Renderer
                    keyValue={`sub_option_${index}_${quesIndex}`}
                    wasSelected={wasSelected}
                    key={`sub_option_${index}_${quesIndex}`} 
                    position={position} 
                    option={option} 
                    index={index} 
                    isCorrect={isCorrect}
            />
        }
    }

    const chooseRenderingOption = ChooseRenderingOption();

    return (
        <div style={{
            marginLeft:"6px"
        }}>
            <span
                dangerouslySetInnerHTML={{
                    __html: !isMultiAnswersQuestion ? `
                        <div style="display:flex;flex-direction:row;">
                            <p style="margin-right:5px;">
                                ${ subQuestionData.status ? 
                                    '<span style="color:green;">&#10004;</span>' 
                                    : 
                                    '<span style="color:red;">&#10008;</span>'
                                }${index+1}.  
                            </p>
                            <p><strong>
                            ${content.question}
                            </strong></p>
                        </div>
                    ` : ""
                }}
            ></span>

            <RenderQuestion index={index} isCorrect={subQuestionData.status}>
                {
                    // @ts-ignore
                    content.options.map(({ option,isCorrect, _id}: IOption,quesIndex) => {   
                            return chooseRenderingOption({
                                wasSelected: subQuestionData.attempted_options.find(x => x.optionID === _id) ? true : false,
                                position:index,
                                index: index,
                                quesIndex: quesIndex,
                                option:option, 
                                isCorrect:isCorrect,
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
                                ${content.additionalInfo}
                            </span>
                        </blockquote>
                    `}}
                ></span>
            </div>
        </div>
    )
}

export default SubQuestionComp;