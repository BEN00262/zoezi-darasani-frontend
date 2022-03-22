// @ts-ignore
import M from "materialize-css"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";

interface ITeacherSubject {
    _id: string
    name: string
    grade: {
        name: string
        isClosed: boolean
        stream: string
        year: number
    }
}

const TeacherSubject: React.FC<ITeacherSubject> = ({ _id, name, grade }) => {
    const navigate = useNavigate();

    return (

        <div className="col s6 m4">
            <div 
                onClick={_ => navigate(`/subject/${_id}`)}
                className="hoverable z-depth-0 truncate" 
                style={{cursor: "pointer", border: "1px solid #d3d3d3",borderRadius: "2px",padding:"5px", marginBottom: "10px"}}>
                <div style={{display: "flex", flexDirection: "row",alignItems: "center"}}>
                    <img
                        style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "contain",
                            border: "1px solid #d3d3d3",
                            borderRadius: "50%"
                        }} 
                        src={`https://www.zoezi-education.com/img/${grade.name.toLowerCase() === "eight" ? "kcpe" : grade.name.toLowerCase()}/${name.toLowerCase() === "sst&cre" ? "social" : name.toLowerCase().split(" ")[0]}.png`}
                    />

                    <ul style={{paddingLeft: "20px"}}>
                        <li style={{
                            // letterSpacing: "2px"
                        }}><b>{name}</b></li>
                        <li className="sub-modal-texts">Stream: {grade.stream}</li>
                        <li className="sub-modal-texts">Year: {grade.year}</li>
                        <li className="sub-modal-texts">
                            <span style={{
                                border: `1px solid ${grade.isClosed ? "red" : "green"}`,
                                paddingRight: "20px",
                                paddingLeft: "20px",
                                borderRadius: "20px",
                                background: `${grade.isClosed ? "rgba(255,0,0,.4)" : "rgba(0,255,0,.4)"}`
                            }}>
                                {grade.isClosed ? "closed": "active"}
                            </span>
                        </li>
                    </ul>
                    
                </div>
            </div>
        </div>
    )
}

export interface ITeacherSubjectsComp {
    subjects: ITeacherSubject[]
}

interface ISortedSubjectDisplay {
    gradeName: string
    subjects: ITeacherSubject[]
}

const TeacherSubjectsComp: React.FC<ITeacherSubjectsComp> = ({ subjects }) => {
    const [display, setDisplay] = useState<ISortedSubjectDisplay[]>([]);

    useEffect(() => {
        // attach the materialize js stuff :)
        M.Collapsible.init(
            document.querySelectorAll('.collapsible')
        )
    }, []);

    useEffect(() => {
        // we have the data lets do the grouping at this point ( this is pretty slow TODO: solve this )
        setDisplay(
            subjects.reduce((acc: ISortedSubjectDisplay[], x: ITeacherSubject) => {
                const foundGrade = acc.find(y => y.gradeName === x.grade.name);

                if (foundGrade) {
                    foundGrade.subjects.push(x);
                    return acc
                }

                return [
                    ...acc,
                    { gradeName: x.grade.name, subjects: [x] }
                ]
            }, [])
        )
    }, [subjects])

    // get the subjects and group them on the grade name i guess :)

    return (
        <div className="row">
            <ul className="collapsible z-depth-0">
                {display.map(({ gradeName, subjects: displaySubjects }, index) => {
                    return (
                        <li key={index}>
                            <div className="collapsible-header" style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <img
                                    style={{
                                        height: "40px",
                                        width: "40px",
                                        objectFit: "contain",
                                        borderRadius: "50%"
                                    }} 
                                    src={`https://www.zoezi-education.com/img/${gradeName.toLowerCase() === "eight" ? "kcpe" : gradeName.toLowerCase()}.png`}
                                />
                                <span style={{
                                    paddingLeft: "5px"
                                }}>{gradeName}</span>
                            </div>
                            <div className="collapsible-body">
                                <div className="row">
                                    {displaySubjects.map((subject, index) => {
                                        return <TeacherSubject key={index} {...subject}/>
                                    })}
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default TeacherSubjectsComp