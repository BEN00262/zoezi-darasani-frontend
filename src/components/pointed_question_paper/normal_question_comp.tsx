import { useState, useEffect, useMemo, useContext, useCallback, createRef, useRef } from 'react';
// @ts-ignore
import M from 'materialize-css';


import { IOption, IQuestion } from '../special_paper_display/rendering_engine/DataLoaderInterface';
import { ILibraryPaperContent, INormalContent } from '../special_paper_display/interfaces/librarypaper';
import { GlobalContext } from '../special_paper_display/contexts/global';
import { useRecoilValue } from 'recoil';
import { selectedQuestionAtom } from '.';

const CheckBoxComp = ({option, index, position}: {
    option: IOption,
    index: number,
    position: number
}) => {
    return (
        <div key={index}>
            <p>
                <label>

                    {/* check if this is the option */}
                    <input 
                        type="checkbox" 
                        className="filled-in" 
                        disabled={true} 
                        checked={option.isCorrect} 
                        name={`options_${position}`}/>

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

const OptionComp = ({option, index, position}: {
    option: IOption,
    index: number,
    position: number
}) => {
    return (
        <div key={index}>
            <p>
                <label>
                    <input 
                        disabled={true}
                        required
                        checked={option.isCorrect}
                        className="with-gap" name={`options_${position}`} type="radio"
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

    const selectedQuestionId = useRecoilValue(selectedQuestionAtom);
    const [suggestedAnswer,setSuggestedAnswer] = useState<{
        _id: string,
        option: string,
        isCorrect: boolean
    }[]>([]);
    
    const [isCorrect, setIsCorrect] = useState<boolean>(false);
    const numberOfCorrectOptions: number = useMemo(() => question?.options_next?.filter(x => x.isCorrect)?.length || 0,[question]);
    const isMultipleOption: boolean = (numberOfCorrectOptions > 1) || false;
    const divRef = useRef(null);

    useEffect(() => {
        if (selectedQuestionId && selectedQuestionId === question._id && divRef.current) {
            // @ts-ignore
            window.scrollTo(0, divRef.current.offsetTop);
        }
    }, [selectedQuestionId, question]);

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
    
    const ChooseRenderingOption = () => {
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index, option}:{
            position: number,
            index: number,
            option: IOption,
        }) => {
            return <Renderer
                    key={index} position={position} 
                    option={option} 
                    index={index} 
            />
        }
    }

    const chooseRenderingOption = ChooseRenderingOption();
    
    return (
        // try to inject the box styling here
        <div ref={divRef} style={{
            border: selectedQuestionId === question._id ? '1px solid red' : 'inherit',
            padding: selectedQuestionId === question._id ? '4px' : 'inherit'
        }} >
            <span
                dangerouslySetInnerHTML={{
                    __html: `
                    <div style="display:flex;flex-direction:row;">
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
                    question.options_next && question.options_next.map((option,index) => {
                        return chooseRenderingOption({
                            position,
                            option,
                            index
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