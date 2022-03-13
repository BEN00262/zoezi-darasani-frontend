import { useCallback, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { INormalContent } from '../../special_paper_display/interfaces/librarypaper';
import { IChildren, IOption } from '../../special_paper_display/rendering_engine/DataLoaderInterface';
import { ITopFailedChildrenStats, totalStudentsInSubject } from '../../TopFailedQuestions';
import { baseQuestionNumberState, isBrokenPassageState, subQuestionsContextState } from './ComprehensionQuestionComp';

const CheckBoxComp = ({option, index, position, optionAnalytics}: {
    option: IOption
    index: number
    keyValue: string
    position: number
    optionAnalytics: number,
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
                                    __html: `
                                        <div>${option.option}</div>
                                        <div class="sub-modal-texts ${option.isCorrect ?'green-text': 'red-text'}">Selected by (${optionAnalytics.toFixed(0)}%) of the students</div>
                                    `
                                }}
                            ></span>
                        </b>
                    </span>
                </label>
            </p>
        </div>
    );
}

const OptionComp = ({option,keyValue,position, optionAnalytics}: {
    option: IOption,
    keyValue: string,
    position: number,
    optionAnalytics: number,
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
                                    __html: `
                                    <div>${option.option}</div>
                                    <div class="sub-modal-texts ${option.isCorrect ?'green-text': 'red-text'}">Selected by (${optionAnalytics.toFixed(0)}%) of the students</div>
                                    `
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
    const baseQuestionNumber = useRecoilValue(baseQuestionNumberState);

    return (
        <div style={{
            marginLeft:"15px",
            marginTop:"5px",
            marginBottom:"5px",
            display:"flex",
            flexDirection:"row",
            alignItems: "flex-start"
        }}>
            <p>{baseQuestionNumber + index}.</p>
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
// 
const SubQuestionComp = ({
    question, index,  savedState, parentId
}:{
    question: IChildren,
    parentId: string
    index: number,
    savedState: INormalContent | null,
}) => {
    const baseQuestionNumber = useRecoilValue(baseQuestionNumberState);
    const subQuestionsContext = useRecoilValue(subQuestionsContextState); // get the entire stuff
    const isBrokenPassage = useRecoilValue(isBrokenPassageState);
    const totalStudents = useRecoilValue(totalStudentsInSubject); // all the students in the class
    const isMultipleOption = useMemo(() => question?.options?.filter(x => x.isCorrect)?.length > 1,[question]);

    const RenderQuestion = isBrokenPassage ? MultiAnswerComp : NonMultiAnswerComp;

    const fetchedSubQuestionContext = useMemo(() => {
        return subQuestionsContext.find(x => x.questionId === question._id) || {} as ITopFailedChildrenStats;
    }, [subQuestionsContext, question]); // only redo if that changes

    const ChooseRenderingOption = () => {
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index, option,quesIndex, optionAnalytics }:{
            position: number
            index: number
            option: IOption
            quesIndex: number,
            optionAnalytics: number
        }) => {
            return <Renderer
                    keyValue={`sub_option_${index}_${quesIndex}`}
                    key={`sub_option_${index}_${quesIndex}`} 
                    position={position} 
                    option={option} 
                    index={index}
                    optionAnalytics={optionAnalytics}
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
                    __html: !isBrokenPassage ? `
                        <div style="display:flex;flex-direction:row;">
                            <p style="margin-right:5px;">
                                ${baseQuestionNumber + index}.  
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
                            // lets get the analytics for the option
                            let optionAnalytics = Object.keys(fetchedSubQuestionContext).length ? ((fetchedSubQuestionContext.choices[option._id]) / (fetchedSubQuestionContext.students || 1)) * 100 : 0;

                            return chooseRenderingOption({
                                position:index,
                                index,
                                quesIndex,
                                option,
                                optionAnalytics: optionAnalytics || 0
                            })
                    })
                }
                <div style={{ 
                    letterSpacing: "1px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }} className="sub-modal-texts blue-text">
                    <i className="material-icons">info</i> <b style={{
                        marginLeft: "4px"
                    }}>Attempted by {fetchedSubQuestionContext.students} ( {(((fetchedSubQuestionContext.students || 0)/(totalStudents || 1))*100).toFixed(0)} %) of the learners</b>
                </div>
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