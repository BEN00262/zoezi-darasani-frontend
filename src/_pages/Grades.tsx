import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import Skeleton from 'react-loading-skeleton'
import EmptyComp from "../components/Empty";
import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext";
import LoaderPage from "./loader";
import { ITeacherComp } from "./TeacherDisplayPage";
import { useQuery } from "react-query";
import { getTheGradeImageFilePath } from "./GradeDisplayPage";

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
                className="hoverable z-depth-0" 
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
                        src={`https://www.zoezieducation.com/img/${getTheGradeImageFilePath(name)}`}
                    />

                    <ul style={{paddingLeft: "20px"}}>
                        {/* <li>Grade {name}</li> */}
                        <li className="sub-modal-texts">Class Teacher: {classTeacher?.name}</li>
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
    const { authToken } = useGlobalZoeziTrackedState();
    const [grades, setGrades] = useState<IGrade[]>([]);
    const [schoolName, setSchoolName] = useState("");

    const {
        isLoading: isFetching, isError, error, isSuccess, data, isIdle
    } = useQuery('in_app_school_grades', () => {
        return axios.get("/api/grade/all", { 
            headers: { 'Authorization': `Bearer ${authToken}`}
        })
        .then(({ data }) => {
            if (data) { return data }
            throw new Error("Unexpected error");
        })
    }, {
        enabled: !!authToken,
        staleTime: 1 * 60 * 1000 // refetch after one minute :)
    })

    useEffect(() => {
        if (isSuccess) {
            setSchoolName(data.school as string);
            setGrades(data.grades as IGrade[]);
        }
    }, [isSuccess])

    if (isFetching || isIdle) {
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
                        isError ?
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
                                    <p>{(error as Error).message}</p>
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
                            isSuccess && grades.length ? 
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