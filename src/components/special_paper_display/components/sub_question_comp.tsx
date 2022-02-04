import { useState, useEffect, useMemo, useContext } from 'react';
import { GlobalContext } from '../contexts/global';
import { IComprehensionContent, INormalContent } from '../interfaces/librarypaper';
import { IChildren } from '../rendering_engine/DataLoaderInterface';

const CheckBoxComp = ({option,wasSelected, isCorrect, _id, isMarked, index, position,setAnswers,isMultiAnswersQuestion}: {
    option: string,
    isCorrect: boolean,
    isMarked: boolean,
    _id: string,
    index: number,
    wasSelected: boolean,
    position: number,
    isMultiAnswersQuestion: boolean,
    setAnswers: (answer:any) => void
}) => {
    return (
        <div key={index}>
            <p>
                <label>
                    <input type="checkbox" checked={wasSelected} className="filled-in" disabled={isMarked} onChange={(e) => {
                        setAnswers({option,isCorrect, _id})
                    }}  required  name={`sub_option_answer_${position}`}/>
                    <span className={isMarked && isCorrect ? "green-text" : "black-text"}>
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

const OptionComp = ({option,wasSelected, isCorrect,_id, isMarked,keyValue,position,setAnswers, isMultiAnswersQuestion}: {
    option: string,
    isCorrect: boolean,
    _id: string,
    keyValue: string,
    isMarked: boolean,
    position: number,
    wasSelected: boolean,
    isMultiAnswersQuestion: boolean,
    setAnswers: (answer:{
        option: string,
        isCorrect: boolean,
        _id: string
    }) => void
}) => {
    return (
            <p key={keyValue}>
                <label>
                    <input disabled={isMarked} checked={wasSelected} required onChange={(e) => {
                        setAnswers({option,isCorrect, _id})
                    }} className="with-gap"
                        type="radio"
                        name={`sub_option_answer_${position}`}
                    />
                    <span className={isMarked && isCorrect ? "green-text" : "black-text"}>
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
            {isMarked ? isCorrect ? <span style={{color:"green"}}>&#10004;</span> : <span style={{color:"red"}}>&#10008;</span>:null}
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
        let historyFound = attemptTree.pages[currentPage].find(x => x.content.question === parentId);

        if (!historyFound) {
            return
        }

        let parentContent = historyFound.content as IComprehensionContent

        let contentFound = parentContent.children.find(x => x.question === question._id) as INormalContent

        if (!contentFound) {
            return
        }

        let attempt_snapshot = (question.options || []).filter(
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
            let setAnswered = suggestedAnswer.every(x => x.isCorrect);
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
            let local_answer_copy = [...suggestedAnswer];
            let foundIndex = local_answer_copy.findIndex(x => x._id === answer._id);

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
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index, option,isCorrect,_id,quesIndex, wasSelected}:{
            position: number,
            index: number,
            option: string,
            isCorrect: boolean,
            quesIndex: number,
            _id: string,
            wasSelected: boolean
        }) => {
            return <Renderer
                    _id={_id}
                    wasSelected={wasSelected}
                    keyValue={`sub_option_${index}_${quesIndex}`}
                    setAnswers={setAnswers} 
                    isMultiAnswersQuestion={isMultiAnswersQuestion}
                    key={`sub_option_${index}_${quesIndex}`} 
                    position={position} 
                    option={option} 
                    index={index} 
                    isCorrect={isCorrect} 
                    isMarked={isMarked}
            />
        }
    }

    const chooseRenderingOption = ChooseRenderingOption();
    // we take the index of the question and thats it
    const checkIfWasSelected = (optionID: string) => !!suggestedAnswer.find(x => (x._id === optionID) || 0);

    return (
        <div style={{
            marginLeft:"6px"
        }}>
            <span
                dangerouslySetInnerHTML={{
                    __html: !isMultiAnswersQuestion ? `
                        <div style="display:flex;flex-direction:row;">
                            <p style="margin-right:5px;">
                                ${isMarked ? isCorrect ? 
                                    '<span style="color:green;">&#10004;</span>' 
                                    : 
                                    '<span style="color:red;">&#10008;</span>':''
                                }${index+1}.  
                            </p>
                            <p><strong>
                            ${question.question}
                            </strong></p>
                        </div>
                    ` : ""
                }}
            ></span>

            <RenderQuestion index={index} isMarked={isMarked} isCorrect={isCorrect}>
                {
                    question.options.map(({option,isCorrect, _id}:{
                        option: string,
                        isCorrect: boolean,
                        _id: string
                    },quesIndex) => {
                            return chooseRenderingOption({
                                _id,
                                position:index,
                                index,
                                quesIndex,
                                option,
                                wasSelected: checkIfWasSelected(_id),
                                isCorrect,
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