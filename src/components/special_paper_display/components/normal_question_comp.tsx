import { useState, useEffect, useMemo, useContext, useCallback } from 'react';
// @ts-ignore
import M from 'materialize-css';


import { IOption, IQuestion } from '../rendering_engine/DataLoaderInterface';
import { ILibraryPaperContent, INormalContent } from '../interfaces/librarypaper';
import { GlobalContext } from '../contexts/global';

const CheckBoxComp = ({option,_id,isCorrect, isMarked, index, position,setSuggestedAnswer, wasSelected}: {
    option: string,
    _id: string,
    isCorrect: boolean,
    isMarked: boolean,
    index: number,
    position: number,
    wasSelected?: boolean
    setSuggestedAnswer: (answer:any) => void
}) => {
    return (
        <div key={index}>
            <p>
                <label>

                    {/* check if this is the option */}
                    <input 
                        type="checkbox" 
                        className="filled-in" 
                        disabled={isMarked} 
                        checked={wasSelected || false}
                        onChange={(e) => {
                            setSuggestedAnswer({option,isCorrect, _id})
                        }}  
                    name={`options_${position}`}/>

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

const OptionComp = ({option,_id,isCorrect, isMarked, index, position,setSuggestedAnswer, wasSelected}: {
    option: string,
    _id: string,
    isCorrect: boolean,
    isMarked: boolean,
    index: number,
    position: number,
    wasSelected?: boolean,
    setSuggestedAnswer: (answer:any) => void
}) => {
    return (
        <div key={index}>
            <p>
                <label>
                    <input 
                        disabled={isMarked} onChange={(e) => {
                            setSuggestedAnswer({option,isCorrect, _id })
                        }} 
                        required
                        checked={wasSelected || false}
                        className="with-gap" name={`options_${position}`} type="radio"
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
        </div>
    )
}

const NormalQuestionComp = ({
    question, position, isMarked, setAttempted, setCorrectAnswersCount,
    savedQuestion, AddPageStudentPaperContent
}: {
    question: IQuestion,
    position: number,
    isMarked: boolean,
    savedQuestion:ILibraryPaperContent | null,
    AddLibraryPaperContents:(content: ILibraryPaperContent) => void,
    setCorrectAnswersCount: (num: number) => void
    setAttempted: (attempted: number) => void
    AddPageStudentPaperContent: (question_id: string, content: ILibraryPaperContent) => void
}) => {
    const {
        currentPage,
        attemptTree
    } = useContext(GlobalContext);

    const [suggestedAnswer,setSuggestedAnswer] = useState<{
        _id: string,
        option: string,
        isCorrect: boolean
    }[]>([]);
    
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const numberOfCorrectOptions: number = useMemo(() => question?.options_next?.filter(x => x.isCorrect)?.length || 0,[question]);
    const isMultipleOption: boolean = (numberOfCorrectOptions > 1) || false;

    const checkIfWasSelected = (optionID: string) => !!suggestedAnswer.find(x => x._id === optionID);

    useEffect(() => {
        let elems = document.querySelectorAll(".question-comp img");
        M.Materialbox.init(elems);

        let historyFound = attemptTree.pages[currentPage].find(x => x.content.question === question._id);

        if (!historyFound) {
            return
        }

        let content = historyFound.content as INormalContent

        let attempt_snapshot = (question.options_next || []).filter(
            (x, optionIndex) => content.attempted_options.findIndex(
                y => (y.optionID === x._id) || (y.optionIndex === optionIndex)
            ) > -1
        )
        
        setIsCorrect(attempt_snapshot.length > 0 ? attempt_snapshot.every(x => x.isCorrect) : false)
        setSuggestedAnswer([
            // @ts-ignore
            ...suggestedAnswer,
            ...attempt_snapshot
        ])
    },[]);

    useEffect(() => {

        if (suggestedAnswer.length > 0) {
            AddPageStudentPaperContent(question._id, {
                questionType: "normal",
                content: {
                    status: suggestedAnswer.length > 0 ? suggestedAnswer.every(x => x.isCorrect) : false,
                    question: question._id,
                    attempted_options: suggestedAnswer.map(answer => ({ 
                        optionID: answer._id,
                        optionIndex: (question.options_next || []).findIndex(x => x._id === answer._id), 
                    }))
                }
            })

        }

    }, [suggestedAnswer])

    useEffect(() => {
        if (isMarked && (numberOfCorrectOptions === suggestedAnswer.length)){
            // this is proving to be wrong we need to first check for the length of the array and default to false 
            // if the array is empty 
            let checkIfCorrect: boolean = suggestedAnswer.length > 0 ? suggestedAnswer.every(x => x.isCorrect) : false;

            setIsCorrect(checkIfCorrect);
            setCorrectAnswersCount(checkIfCorrect ? 1 : 0);  
        }
    },[isMarked]);

    // cache this motherfucker
    const setSuggestedAnswerFunc = (trial: {
        _id: string,
        option: string,
        isCorrect: boolean
    }) => {
        if (!suggestedAnswer.length){ setAttempted(1); }

        if (isMultipleOption){
            const isOptionExisting = suggestedAnswer.findIndex(x => x.option === trial.option);

            if (isOptionExisting > -1){
                let localSuggestedAnswer = [...suggestedAnswer];
                localSuggestedAnswer.splice(isOptionExisting);
                // rerenders the logic
                setSuggestedAnswer(localSuggestedAnswer);
                if(!localSuggestedAnswer.length){ setAttempted(-1); }
                return;
            }

            setSuggestedAnswer([ ...suggestedAnswer,trial ]);
            return;
        }

        setSuggestedAnswer([ trial ]);
    };
    
    const ChooseRenderingOption = () => {
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index,_id, option,isCorrect, wasSelected}:{
            _id: string,
            position: number,
            index: number,
            option: string,
            isCorrect: boolean,
            wasSelected?: boolean
        }) => {
            return <Renderer
                    _id={_id}
                    setSuggestedAnswer={setSuggestedAnswerFunc} 
                    key={index} position={position} 
                    option={option} 
                    index={index} 
                    isCorrect={isCorrect} 
                    isMarked={isMarked}
                    wasSelected={wasSelected}
            />
        }
    }

    const chooseRenderingOption = ChooseRenderingOption();
    
    return (
        // try to inject the box styling here
        <div>
            <span
                dangerouslySetInnerHTML={{
                    __html: `
                    <div style="display:flex;flex-direction:row;">
                        ${isMarked ? isCorrect ? '<span style="color:green;">&#10004;</span>' : '<span style="color:red;">&#10008;</span>':''} 
                        <p style="margin-right:5px;">${position+1}.  </p><strong class="question-comp">${question.question}</strong>
                    </div>
                `}}
            ></span>

            <div style={{
                marginTop:"10px",
                marginLeft:"17px",
                marginBottom: "10px"
            }}>
                {
                    question.options_next && question.options_next.map(({option,isCorrect, _id},index) => {
                        return chooseRenderingOption({
                            position,
                            _id,
                            option,
                            index,
                            isCorrect,
                            wasSelected: checkIfWasSelected(_id)
                        })
                    })
                }
            </div>

            <div style={{
                marginLeft:"17px",
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

export default NormalQuestionComp;