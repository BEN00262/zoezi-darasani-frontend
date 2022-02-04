import { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import M from 'materialize-css';


// import { IQuestion } from '../rendering_engine/DataLoaderInterface';
import { IContent, InternalContentType } from '../interface/ILibPaper';

const CheckBoxComp = ({option,isCorrect, wasSelected, index, position}: {
    option: string,
    isCorrect: boolean,
    wasSelected: boolean,
    index: number,
    position: number
}) => {
    return (
        <div key={index}>
            <p>
                <label>
                    <input type="checkbox" checked={wasSelected} className="filled-in" disabled name={`options_${position}`}/>
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

const OptionComp = ({option,isCorrect, wasSelected, index, position}: {
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
                    <input disabled checked={wasSelected} required className="with-gap" name={`options_${position}`} type="radio"/>
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
    )
}

const NormalQuestionComp = ({content, position }: {
    content: InternalContentType,
    position: number,
}) => {

    const numberOfCorrectOptions: number = useMemo(() => content.question.options_next?.filter(x => x.isCorrect)?.length || 0,[content.question]);
    const isMultipleOption: boolean = (numberOfCorrectOptions > 1) || false;

    useEffect(() => {
        let elems = document.querySelectorAll(".question-comp img");
        M.Materialbox.init(elems);
    },[]);

    const ChooseRenderingOption = () => {
        let Renderer = isMultipleOption ? CheckBoxComp : OptionComp;

        return ({position, index, option,isCorrect, wasSelected}:{
            position: number,
            index: number,
            option: string,
            isCorrect: boolean,
            wasSelected: boolean
        }) => {
            return <Renderer
                    key={index} position={position} 
                    option={option} 
                    index={index} 
                    wasSelected={wasSelected}
                    isCorrect={isCorrect}
            />
        }
    }

    const chooseRenderingOption = ChooseRenderingOption();
    
    return (
        <div>
            <span
                dangerouslySetInnerHTML={{
                    __html: `
                    <div style="display:flex;flex-direction:row;">
                        ${content.status ? '<span style="color:green;">&#10004;</span>' : '<span style="color:red;">&#10008;</span>'} 
                        <p style="margin-right:5px;">${position+1}.  </p><strong class="question-comp">${content.question.question}</strong>
                    </div>
                `}}
            ></span>

            <div style={{
                marginTop:"10px",
                marginLeft:"17px",
                marginBottom: "10px"
            }}>
                {
                    // the magic starts here
                    content.question.options_next && content.question.options_next.map(({option,isCorrect, _id},index) => {
                        
                        
                        return chooseRenderingOption({
                            wasSelected: content.attempted_options.find(x => x.optionID === _id) ? true : false,
                            position,
                            option,
                            index,
                            isCorrect,
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
                            ${content.question.additionalInfo}
                            </span>
                        </blockquote>
                    `}}
                ></span>
            </div>
        </div>
    )
}

export default NormalQuestionComp;