import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import Skeleton from 'react-loading-skeleton'
import EmptyComp from "../components/Empty";
import { GlobalContext } from "../contexts/GlobalContext";
import LoaderPage from "./loader";
import { ITeacherComp } from "./TeacherDisplayPage";

export interface IGrade {
    _id: string
    name: string
    stream: string
    year: number
    classTeacher: ITeacherComp
    classRef?: {
        students: string[]
    }
}

const Grade: React.FC<IGrade> = ({ _id, name, classTeacher, classRef, stream, year }) => {
    const navigate = useNavigate();

    return (
        <div className="col s12 m4">
            <div
                onClick={_ => navigate(`/grades/${_id}`)}
                className="hoverable z-depth-1" 
                style={{cursor: "pointer", marginBottom: "10px", border: "1px solid #d3d3d3",borderRadius: "2px",padding:"5px"}}>
                <div style={{display: "flex", flexDirection: "row",alignItems: "center"}}>
                    <img
                        style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "contain",
                            border: "1px solid #d3d3d3",
                            borderRadius: "50%"
                        }} 
                        src={`https://www.zoezi-education.com/img/${name.toLowerCase()}.png`}
                    />

                    <ul style={{paddingLeft: "20px"}}>
                        {/* <li>Grade {name}</li> */}
                        <li className="sub-modal-texts">Class Teacher: {classTeacher.name}</li>
                        <li className="sub-modal-texts">Stream: {stream}</li>
                        <li className="sub-modal-texts">Year: {year}</li>
                        <li className="sub-modal-texts">{(classRef?.students || []).length} learners</li>
                    </ul>
                    
                </div>
            </div>
        </div>
    )
}

const GradesPage = () => {
    const { authToken } = useContext(GlobalContext);
    const [grades, setGrades] = useState<IGrade[]>([]);
    const [schoolName, setSchoolName] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // fetch the grades of the current school
        setIsFetching(true);

        axios.get("/api/grade/all", { headers: { 'Authorization': `Bearer ${authToken}`}})
            .then(({ data }) => {
                if (data) {
                    setSchoolName(data.school as string);
                    setGrades(data.grades as IGrade[]);
                    return;
                }

                throw new Error("Unexpected error");
            })
            .catch((error: Error) => {
                setError(error.message)
            })
            .finally(() => {
                setIsFetching(false);
            })
    }, []);

    if (isFetching) {
        return <LoaderPage/>
    }

    return (
        <main>
            <div className="container">
                <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                <h5 className="center sub-sub-headings">
                    {
                        schoolName ?
                        <>{schoolName} Grades</>
                        :
                        <Skeleton/>
                    }
                </h5>
                <div className="divider"></div>
                <div className="section">
                    {
                        error ?
                        <div className="row">
                            <div className="col s12">
                                <div className="sub-modal-texts" style={{
                                    borderLeft: "2px solid red",
                                    paddingLeft: "5px",
                                    paddingRight: "5px",
                                    borderRadius: "3px",
                                    lineHeight: "4em",
                                    backgroundColor: "rgba(255,0,0, 0.1)",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <i className="material-icons left">error_outline</i>
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                    <div className="row">
                        <div className="col s12">
                            <Link to="/grades/new" className="waves-effect waves-light sub-modal-texts btn-flat" style={{
                                border: "1px solid #d3d3d3"
                            }}>
                            <b><i className="material-icons right">add_circle_outline</i>Add Grade</b>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        {
                            grades.length ? 
                            <>
                                {grades.map((grade, index) => {
                                    return <Grade key={index} {...grade}/>
                                })}
                            </> :
                             <EmptyComp message="There aren't any created grades"/>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default GradesPage