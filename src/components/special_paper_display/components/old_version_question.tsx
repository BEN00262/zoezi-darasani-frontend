import { useState, useEffect, useCallback, useMemo } from 'react';
import { ILibraryPaperContent } from '../interfaces/librarypaper';
import { IQuestion } from '../rendering_engine/DataLoaderInterface';

const OldVersionQuestion = ({ question, position, setAttempted,setCorrectAnswersCount,AddLibraryPaperContents, isMarked=false }: {
    question: IQuestion,
    position: number,
    isMarked: boolean,
    AddLibraryPaperContents:(content: ILibraryPaperContent) => void,
    setCorrectAnswersCount: (num: number) => void,
    setAttempted: (attempted: number) => void
}) => {
    const [answer,setAnswer] = useState<string>("");
    const [isCorrect,setIsCorrect] = useState<boolean>(false);

    const markAnswer = (e: any) => {
        const attempted: string = e.target.value;
        const incrementValue: number = !answer && attempted ? 1 : !attempted ? -1 : 0;
        setAttempted(incrementValue);
        setAnswer(e.target.value);
    }

    const markQuestion = useCallback(() => {
        return answer.toLocaleLowerCase() === question.answer.toLowerCase();
    },[answer,question,isMarked]);
    
    const checkIfKiswahili = useMemo(() => 
        question.subject.split(" ")[0].toLowerCase() === "kiswahili",
    [question]);

    useEffect(() => {
        let markedAnswer: boolean = markQuestion();
        setIsCorrect(markedAnswer);
        setCorrectAnswersCount(markedAnswer ? 1 : 0);

        AddLibraryPaperContents({
            questionType: "oldversion",
            content: {
                status: markedAnswer,
                question: question._id,
                attempted_option: answer
            }
        })
    },[isMarked]);

    return (
        <div className="col s12" style={{
            marginBottom:"7px"
        }}>
            <div style={{
                display:"flex",
                flexDirection:"row"
            }}>
                {isMarked ? isCorrect ? <span style={{color:"green"}}>&#10004;</span> : <span style={{color:"red"}}>&#10008;</span>:null}
                <span style={{
                    marginRight:"5px"
                }}>{position+1}. </span>
                <p>
                    <span className="left-align">
                            {question.question}
                        <span className="left-align"><br/>
                            <b>{question.options}</b>
                        </span>
                    </span>
                </p>
            </div>

            <div style={{
                marginLeft:"15px"
            }}>
                <div className="input-field col s12">
                    <input title="Enter A B C or D" 
                        onChange={markAnswer}
                        disabled={isMarked}
                        value={answer}
                        id={`trial_answer${position}`} 
                        required type="text" 
                        className="validate"
                        style={{
                            color:isMarked ? markQuestion() ? "green" : "red" : "black"
                        }}
                        />
                    <label htmlFor={`trial_answer${position}`}>
                        { checkIfKiswahili ? 'Jibu' : 'Answer' }
                    </label>
                </div>

                <div hidden={!isMarked} className="col s12">
                    <blockquote className="green lighten-5" style={{
                        borderLeftColor:"#00e676"
                    }}>
                        <p id={`correct_answer_display${position}`} className="bold">
                            { checkIfKiswahili ? 'Jibu Sahihi: ' : 'Correct Answer: ' }
                            { question.answer }
                        </p>
                    </blockquote>
                </div>

                <div hidden={!isMarked} className="col s12">
                    <blockquote className="red lighten-5">
                        <p id={`additional_information${position}`} className="bold">
                            {question.additionalInfo}
                        </p>
                    </blockquote>
                </div>
            </div>

        </div>
    )
}

export default OldVersionQuestion;