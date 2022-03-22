// @ts-ignore
import M from "materialize-css"
import { useParams } from "react-router-dom"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext";
import { ITeacherComp } from "./TeacherDisplayPage";
import LoaderComp from "../components/LoaderComp";
import EditGrade from "./EditGrade";
import Skeleton from "react-loading-skeleton";
import { atom, useSetRecoilState } from "recoil";
import { useQuery } from "react-query";

// dynamic imports
const GradePerformanceSuspense = React.lazy(() => import("./GradePerfomance"));
const LearnersSuspense = React.lazy(() => import("./Learners"));
const SubjectsCompSuspense = React.lazy(() => import("./Subjects"));
const MetricsCompSuspense = React.lazy(() => import("./Metrics"));

interface IGrade {
    _id: string
    name: string
    stream: string
    isClosed: boolean
    year: number
    classTeacher: ITeacherComp
    classRef?: string
}

/*
    localStorage.setItem("classId", _grade._id);
    localStorage.setItem("classRefId", _grade.classRef || "");
    localStorage.setItem("gradeName", _grade.name);
*/

export const gradeNameState = atom<string>({
    key: "gradeNameId",
    default: "",
    effects: [
        ({ onSet, trigger, setSelf }) => {
            if (trigger === "get") {
                setSelf(localStorage.getItem("gradeName") || "")
            }

            onSet((newValue, _, isReset) => {
                isReset ? localStorage.removeItem("gradeName") : localStorage.setItem("gradeName", newValue);
            })
        }
    ]
});

export const classIdState = atom<string>({
    key: "classIdStateId",
    default: "",
    effects: [
        ({ onSet, trigger, setSelf }) => {
            if (trigger === "get") {
                setSelf(localStorage.getItem("classId") || "")
            }

            onSet((newValue, _, isReset) => {
                isReset ? localStorage.removeItem("classId") : localStorage.setItem("classId", newValue);
            })
        }
    ]
});

export const classRefIdState = atom<string>({
    key: "classRefIdStateId",
    default: "",
    effects: [
        ({ onSet, trigger, setSelf }) => {
            if (trigger === "get") {
                setSelf(localStorage.getItem("classRefId") || "")
            }

            onSet((newValue, _, isReset) => {
                isReset ? localStorage.removeItem("classRefId") : localStorage.setItem("classRefId", newValue);
            })
        }
    ]
});


const GradeDisplayPage = () => {
    const { authToken, isTeacher } = useGlobalZoeziTrackedState();

    const setGradeName = useSetRecoilState(gradeNameState);
    const setClassIdState = useSetRecoilState(classIdState);
    const setClassRefIdState = useSetRecoilState(classRefIdState);

    const [classMeanScore, setClassMeanScore] = useState(0);
    const params = useParams();
    const [grade, setGrade] = useState<IGrade>({
        _id: "", classTeacher: {_id: "", email: "", name: "", profilePic: ""}, name: "", stream: "", year: (new Date()).getFullYear(), isClosed: true
    });

    const { isError, error, data, isSuccess } = useQuery(['in_app_grade_display', params.id], () => {
        return axios.get(`/api/grade/${params.id}`, { headers: {
            'Authorization': `Bearer ${authToken}`
        }})
            .then(({ data }) => {
                if (data) { return (data.grade as IGrade) }
                throw new Error("Unexpected error!")
            })
    }, {
        enabled: !!authToken && !!params.id,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setClassIdState(data._id);
            setClassRefIdState(data.classRef || "");
            setGradeName(data.name);
            setGrade(data);
        }
    }, [isSuccess])

    useEffect(() => {
        M.Tabs.init(document.querySelector(".tabs"), {})

        M.Sidenav.init(document.querySelectorAll('.sidenav'), {
            edge: "right"
        });
    }, []);

    return (
        <main>
            <EditGrade/>
            <div style={{margin: "0 auto", maxWidth: "1280px", width: "90%"}}>
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
                    <div className="col s12 m2 center sticky-side" style={{
                            borderRight: "1px solid #d3d3d3",
                        }}>
                        <div>
                        {/* place the class icon at the top */}
                        <img
                            style={{
                                height: "100px",
                                width: "100px",
                                objectFit: "contain",
                                border: "1px solid #d3d3d3",
                                borderRadius: "50%"
                            }} 
                            src={`https://www.zoezi-education.com/img/${grade.name.toLowerCase() === "eight" ? "kcpe" : grade.name.toLowerCase()}.png`}
                        />
                        {/* then the class teacher */}
                        <br />
                        {/* <span className="sub-modal-texts">Class Teacher: {grade.classTeacher.name}</span> */}
                        <div className="row sub-modal-texts">
                            <div className="col s12 truncate">
                                Class Teacher: {grade.classTeacher.name ? grade.classTeacher.name : <Skeleton/>}
                            </div>
                            <div className="col s12 truncate">
                                Stream: {grade.stream ? grade.stream : <Skeleton/>}
                            </div>
                            <div className="col s12 truncate">
                                Year: {grade.year ? grade.year : <Skeleton/>}
                            </div>
                            <div className="col s12">
                                <span style={{
                                    border: `1px solid ${grade.isClosed ? "red" : "green"}`,
                                    paddingRight: "20px",
                                    paddingLeft: "20px",
                                    borderRadius: "20px",
                                    background: `${grade.isClosed ? "rgba(255,0,0,.4)" : "rgba(0,255,0,.4)"}`
                                }}>
                                    {grade.isClosed ? "closed": "active"}
                                </span>
                            </div>
                        </div>
                        <div hidden={isTeacher}>
                            <br />
                            <a href="#" data-target="edit-grade" className="waves-effect waves-light btn-flat sidenav-trigger" style={{
                                border: "1px solid teal",
                                borderRadius: "20px"
                            }}>
                                <i className="material-icons right">edit</i>Edit Grade
                            </a>
                            <button className="btn-flat red-text" style={{
                                border: "1px solid red",
                                marginTop: "5px",
                                borderRadius: "20px"
                            }}>
                                <i className="material-icons right">delete</i>Delete Grade
                            </button>
                        </div>
                        </div>
                    </div>
                    
                    <div className="col s12 m10">
                            <div className="row center">
                                <h4 className="sub-names teal-text">{classMeanScore.toFixed(2)}</h4>
                                <span className="sub-modal-texts"><b>Class Mean Score</b></span>
                            </div>

                        <div className="row">
                    <div className="col s12">
                        <ul className="tabs tabs-fixed-width" style={{
                            overflowX: "hidden"
                        }}>
                            <li className="tab col s3"><a href="#learners">Learners</a></li>
                            <li className="tab col s3"><a href="#metrics">Gender Distribution</a></li>
                            <li className="tab col s3"><a className="active" href="#perfomance">Perfomance</a></li>
                            <li className="tab col s3"><a href="#subjects">Subjects</a></li>
                        </ul>
                    </div>
                        </div>
                        <div className="row">
                            <div id="learners" className="col s12">
                                {/* shows all the current learners in the system for the given grade */}
                                {/* <Learners classRefId={grade.classRef}/> */}
                                {<React.Suspense fallback={<LoaderComp/>}>
                                    <LearnersSuspense classRefId={grade.classRef || null}/>
                                </React.Suspense>}
                            </div>

                            <div id="perfomance" className="col s12">
                                <React.Suspense fallback={<LoaderComp/>}>
                                    <GradePerformanceSuspense setClassMeanScore={setClassMeanScore}/>
                                </React.Suspense>
                            </div>

                            <div id="subjects" className="col s12">
                                <React.Suspense fallback={<LoaderComp/>}>
                                    <SubjectsCompSuspense gradeName={grade.name}/>
                                </React.Suspense>
                            </div>
                            <div id="metrics" className="col s12">
                                <React.Suspense fallback={<LoaderComp/>}>
                                    <MetricsCompSuspense/>
                                </React.Suspense>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </main>
    )
}

export default GradeDisplayPage