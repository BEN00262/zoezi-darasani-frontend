import { useState, useEffect, useMemo, useContext } from 'react';
import { GlobalContext } from '../special_paper_display/contexts/global';
import { IComprehensionContent, INormalContent } from '../special_paper_display/interfaces/librarypaper';
import { IChildren, IOption } from '../special_paper_display/rendering_engine/DataLoaderInterface';

const CheckBoxComp = ({option,index, position}: {
    option: IOption,
    index: number,
    position: number
}) => {
    return (
        <div key={index}>
            <p>
                <label>
                    <input type="checkbox" checked={option.isCorrect} className="filled-in" disabled={true} required  name={`sub_option_answer_${position}`}/>
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

const OptionComp = ({option,keyValue,position}: {
    option: IOption,
    keyValue: string,
    position: number,
}) => {
    return (
            <p key={keyValue}>
                <label>
                    <input disabled={true} checked={option.isCorrect} required className="with-gap"
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

const MultiAnswerComp = ({ children, index, isMarked, isCorrect }: {
    children: any,
    index: number,
    isMarked: boolean,
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

const SubQuestionComp = ({
    question, index,AddInternalPaperContents, 
    setAttempted, setCorrectAnswersCount, savedState, parentId
}:{
    question: IChildren,
    parentId: string
    index: number,
    savedState: INormalContent | null,
    AddInternalPaperContents: (content: INormalContent) => void,
    setCorrectAnswersCount: (num: number) => void,
    setAttempted: (attempted: number) => void
}) => {
    const {
        attemptTree,
        currentPage,
        isMarked
    } = useContext(GlobalContext);

    const [suggestedAnswer,setSuggestedAnswer] = useState<{ _id: string, option: string,isCorrect: boolean }[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const [submitToParent, setSubmitToParent] = useState<number>(0);


    useEffect(() => {
        const historyFound = attemptTree.pages[currentPage].find(x => x.content.question === parentId);

        if (!historyFound) {
            return
        }

        const parentContent = historyFound.content as IComprehensionContent

        const contentFound = parentContent.children.find(x => x.question === question._id) as INormalContent

        if (!contentFound) {
            return
        }

        const attempt_snapshot = (question.options || []).filter(
            (x, optionIndex) => contentFound ? contentFound.attempted_options.findIndex(y => (y.optionID === x._id) || (y.optionIndex === optionIndex)) > -1 : false
        )

        setIsCorrect(contentFound.status);

        setSuggestedAnswer([
            // @ts-ignore
            ...suggestedAnswer,
            ...attempt_snapshot
        ])
    }, []);

    // this collects it here which wont work in our current paper model
    // we need to collect it in change
    useEffect(() => {
        if(isMarked && suggestedAnswer.length > 0){
            const setAnswered = suggestedAnswer.every(x => x.isCorrect);
            setIsCorrect(setAnswered);
        }
    },[isMarked, suggestedAnswer]);

    useEffect(() => {
        if (submitToParent > 0) {

            // suggestedAnswer.length ? suggestedAnswer.every(x => x.isCorrect) : false
            AddInternalPaperContents({
                status: suggestedAnswer.length ? suggestedAnswer.every(x => x.isCorrect) : false,
                question: question._id,
                attempted_options: suggestedAnswer.map(answer => ({
                    optionID: answer._id,
                    optionIndex: question.options.findIndex(x => x._id === answer._id),
                }))
            })
        }
    }, [submitToParent]);

    const isMultipleOption = useMemo(() => question?.options?.filter(x => x.isCorrect)?.length > 1,[question]);
    const isMultiAnswersQuestion: boolean = question.question.trim().replace(/(<([^>]+)>)/ig, "").trim().length <= 1;

    const setAnswers = (answer:{
        _id: string,
        option: string,
        isCorrect: boolean
    }):void => {
        if (!suggestedAnswer.length){ setAttempted(1); }

        // this is absimal af
        if (isMultipleOption) {
            const local_answer_copy = [...suggestedAnswer];
            const foundIndex = local_answer_copy.findIndex(x => x._id === answer._id);

            if (foundIndex > -1) {
                local_answer_copy[foundIndex] = answer;
            } else { local_answer_copy.push(answer); }

            setSuggestedAnswer(local_answer_copy);
        } else {
            setSuggestedAnswer([answer]);
        }

        // allow the submission of the attempts to the parent
        setSubmitToParent(old => old + 1); // allows the sending to parent stuff
    }

    const RenderQuestion = isMultiAnswersQuestion ? MultiAnswerComp : NonMultiAnswerComp;

    const ChooseRenderingOption = () => {
        const Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index, option,quesIndex}:{
            position: number,
            index: number,
            option: IOption,
            quesIndex: number,
        }) => {
            return <Renderer
                    keyValue={`sub_option_${index}_${quesIndex}`}
                    key={`sub_option_${index}_${quesIndex}`} 
                    position={position} 
                    option={option} 
                    index={index}
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
                            <p style="margin-right:5px;">${index+1}.</p>
                            <p><strong>${question.question}</strong></p>
                        </div>
                    ` : ""
                }}
            ></span>

            <RenderQuestion index={index} isMarked={isMarked} isCorrect={isCorrect}>
                {
                    question.options.map((option,quesIndex) => {
                            return chooseRenderingOption({
                                position:index,
                                index,
                                quesIndex,
                                option
                            })
                    })
                }
            </RenderQuestion>

            <div style={{
                marginLeft:"15px",
                marginBottom: "10px"
            }} hidden={!isMarked}>
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