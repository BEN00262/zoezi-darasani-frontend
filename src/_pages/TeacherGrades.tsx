import { useNavigate } from "react-router-dom";
import { getTheGradeImageFilePath } from "./GradeDisplayPage";

export interface Grade {
    _id: string
    name: string
    year: number
    stream: string
    classRef: {
        students: string[]
    }
}

export interface ITeacherGrades {
    grades: Grade[]
}

// we want a converter for the grades name :)

const TeacherGrade: React.FC<Grade> = ({ _id, name, year, stream, classRef }) => {
    const navigate = useNavigate();

    return (
        <div className="col s12 m4">
            <div 
                onClick={_ => navigate(`/grades/${_id}`)}
                className="hoverable z-depth-0" 
                style={{cursor: "pointer", border: "1px solid #d3d3d3",marginBottom: "10px",borderRadius: "2px",padding:"5px"}}>
                <div style={{display: "flex", flexDirection: "row",alignItems: "center"}}>
                    <img
                        style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "contain",
                            border: "1px solid #d3d3d3",
                            borderRadius: "50%"
                        }} 
                        src={`https://www.zoezieducation.com/img/${getTheGradeImageFilePath(name)}`}
                    />

                    <ul style={{paddingLeft: "20px"}}>
                        <li className="sub-modal-texts">Stream: {stream}</li>
                        <li className="sub-modal-texts">Year: {year}</li>
                        <li className="sub-modal-texts">{classRef.students.length} learners</li>
                    </ul>
                    
                </div>
            </div>
        </div>
    )
}

const TeacherGrades: React.FC<ITeacherGrades> = ({ grades }) => {
    return (
        <div className="row">
            {grades.map((grade, index) => {
                return <TeacherGrade key={index} {...grade}/>
            })}
        </div>
    )
}

export default TeacherGrades