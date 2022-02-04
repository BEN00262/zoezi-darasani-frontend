import { InternalContentType } from '../interface/ILibPaper';

const OldVersionQuestion = ({ content, isKiswahili, position }: {
    content: InternalContentType,
    position: number,
    isKiswahili: boolean
}) => {
    return (
        <div className="col s12" style={{
            marginBottom:"7px"
        }}>
            <div style={{
                display:"flex",
                flexDirection:"row"
            }}>
                {content.status ? <span style={{color:"green"}}>&#10004;</span> : <span style={{color:"red"}}>&#10008;</span>}
                <span style={{
                    marginRight:"5px"
                }}>{position+1}. </span>
                <p>
                    <span className="left-align">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: content.question.question
                                }}
                            >
                            </span>
                        <span className="left-align"><br/>
                            <b>{content.question.options}</b>
                        </span>
                    </span>
                </p>
            </div>

            <div style={{
                marginLeft:"15px"
            }}>
                <div className="input-field col s12">
                    <input title="Enter A B C or D"
                        disabled
                        value={content.attempted_option}
                        id={`trial_answer${position}`} 
                        required type="text" 
                        className="validate"
                        style={{
                            color:content.status ? "green" : "red"
                        }}
                        />
                    <label htmlFor={`trial_answer${position}`}>
                        { isKiswahili ? 'Jibu' : 'Answer' }
                    </label>
                </div>

                <div className="col s12">
                    <blockquote className="green lighten-5" style={{
                        borderLeftColor:"#00e676"
                    }}>
                        <p id={`correct_answer_display${position}`} className="bold">
                            { isKiswahili ? 'Jibu Sahihi: ' : 'Correct Answer: ' }
                            { content.question.answer }
                        </p>
                    </blockquote>
                </div>

                <div className="col s12">
                    <blockquote className="red lighten-5">
                        <p id={`additional_information${position}`} className="bold" 
                        
                            dangerouslySetInnerHTML={{
                                __html:`${content.question.additionalInfo}`
                            }}
                        >
                        </p>
                    </blockquote>
                </div>
            </div>

        </div>
    )
}

export default OldVersionQuestion;