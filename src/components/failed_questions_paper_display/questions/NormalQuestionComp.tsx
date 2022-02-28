import { useEffect, useMemo } from 'react';
// @ts-ignore
import M from 'materialize-css';


import { IOption } from '../../special_paper_display/rendering_engine/DataLoaderInterface';
import { ITopFailedPaperQuestion, totalStudentsInSubject } from '../../TopFailedQuestions';
import { useRecoilValue } from 'recoil';

const CheckBoxComp = ({option,index, position, analytics}: {
    option: IOption,
    index: number,
    position: number,
    analytics: string // ( percentage of the students that selected the option )
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

const OptionComp = ({option,index, position, analytics}: {
    option: IOption,
    index: number,
    position: number,
    analytics: string // ( percentage of the students that selected the option )
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
                                __html: `
                                <div>${option.option}</div>
                                <div class="sub-modal-texts ${option.isCorrect ?'green-text': 'red-text'}">Selected by (${analytics}%) of the students</div>
                                `
                            }}
                        ></span>
                        </b>
                    </span>
                </label>
            </p>
        </div>
    )
}

// we have the question and its stats ---> now what ?
const NormalQuestionComp: React.FC<ITopFailedPaperQuestion & { position: number }> = ({
    question, failed, students: studentsTotal, position, choices
}) => {
    const totalStudentsInSubjectValue = useRecoilValue(totalStudentsInSubject);
    const numberOfCorrectOptions: number = useMemo(() => question?.options_next?.filter(x => x.isCorrect)?.length || 0,[question]);
    const isMultipleOption: boolean = (numberOfCorrectOptions > 1) || false;

    useEffect(() => {
        let elems = document.querySelectorAll(".question-comp img");
        M.Materialbox.init(elems);
    },[]);
    
    const ChooseRenderingOption = () => {
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({index, option, analytics}:{
            index: number,
            option: IOption,
            analytics: string // ( percentage of the students that selected the option )
        }) => {
            return <Renderer
                    key={index} 
                    analytics={analytics}
                    position={index + 1} 
                    option={option} 
                    index={index}
            />
        }
    }

    const chooseRenderingOption = ChooseRenderingOption();
    
    return (
        <div>
            <span
                dangerouslySetInnerHTML={{
                    __html: `
                    <div style="display:flex;flex-direction:row;align-items:flex-start;">
                        <p style="margin-right:5px;">${position}.  </p>
                        <div>
                            <strong class="question-comp">${question.question}</strong>
                            <span class="sub-modal-texts green-text" style="margin-left:5px;">
                                <b>[ Attempted by ${studentsTotal} (${((studentsTotal/(totalStudentsInSubjectValue || 1))*100).toFixed(0)}%) student(s) ]</b>
                            </span>

                            <span class="sub-modal-texts red-text" style="margin-left:5px;">
                                <b>[ Failed by ${((failed/studentsTotal)*100).toFixed(0)}% of the students ]</b>
                            </span>
                        </div>
                    </div>
                `}}
            ></span>

            <div style={{
                marginTop:"10px",
                marginLeft:"17px",
                marginBottom: "10px"
            }}>
                {/* pass per option analytics here :) */}
                {
                    question.options_next && question.options_next.map((option,index) => {
                        // lets compute the analytics now :)
                        // get the option
                        let foundOption = Object.keys(choices).find(x => x === option._id);

                        return chooseRenderingOption({
                            option,
                            index,
                            analytics: (((foundOption ? (choices[option._id] || 0) : 0)/studentsTotal) * 100).toFixed(0)
                        })
                    })
                }
            </div>

            <div style={{
                marginLeft:"17px",
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

export default NormalQuestionComp;