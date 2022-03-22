import { useEffect, useMemo, useRef } from 'react';
// @ts-ignore
import M from 'materialize-css';


import { IOption, IQuestion } from '../special_paper_display/rendering_engine/DataLoaderInterface';
import { ILibraryPaperContent } from '../special_paper_display/interfaces/librarypaper';
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

const NormalQuestionComp = ({ question, position, isMarked }: {
    question: IQuestion,
    position: number,
    isMarked: boolean,
    savedQuestion:ILibraryPaperContent | null,
    AddLibraryPaperContents:(content: ILibraryPaperContent) => void,
    setCorrectAnswersCount: (num: number) => void
    setAttempted: (attempted: number) => void
    AddPageStudentPaperContent: (question_id: string, content: ILibraryPaperContent) => void
}) => {
    const selectedQuestionId = useRecoilValue(selectedQuestionAtom);
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
        M.Materialbox.init(document.querySelectorAll(".question-comp img"));
    },[]);
    
    const ChooseRenderingOption = () => {
        const Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

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
            borderRadius: selectedQuestionId === question._id ? "4px" : "inherit",
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