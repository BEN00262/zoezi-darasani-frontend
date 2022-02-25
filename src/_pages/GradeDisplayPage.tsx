// @ts-ignore
import M from "materialize-css"
import { Link, useParams } from "react-router-dom"
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../contexts/GlobalContext";
import { ITeacherComp } from "./TeacherDisplayPage";
import LoaderComp from "../components/LoaderComp";
import EditGrade from "./EditGrade";
import Skeleton from "react-loading-skeleton";

// dynamic imports
const GradePerformanceSuspense = React.lazy(() => import("./GradePerfomance"));
const SubscriptionsDisplaySuspense = React.lazy(() => import("./SubscriptionsDisplay"));
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

const GradeDisplayPage = () => {
    const { authToken, isTeacher } = useContext(GlobalContext);
    const [classMeanScore, setClassMeanScore] = useState(0);
    const params = useParams();
    const [grade, setGrade] = useState<IGrade>({
        _id: "", classTeacher: {_id: "", email: "", name: "", profilePic: ""}, name: "", stream: "", year: (new Date()).getFullYear(), isClosed: true
    })

    useEffect(() => {
        // fetch the grade data
        axios.get(`/api/grade/${params.id}`, { headers: {
            'Authorization': `Bearer ${authToken}`
        }})
            .then(({ data }) => {
                if (data) {
                    let _grade = data.grade as IGrade

                    // use local storage to store the values
                    // find a way to set this in a better way :)
                    localStorage.setItem("classId", _grade._id);
                    localStorage.setItem("classRefId", _grade.classRef || "");
                    localStorage.setItem("gradeName", _grade.name);
                    
                    setGrade(_grade)
                }
            })

        M.Tabs.init(document.querySelector(".tabs"), {
            // swipeable: true
        })

        M.Sidenav.init(document.querySelectorAll('.sidenav'), {
            edge: "right"
        });
    }, []);

    return (
        <main>
            <EditGrade/>
            <div style={{margin: "0 auto", maxWidth: "1280px", width: "90%"}}>
            <div className="section">
                {/* should we use the  */}
                {/* the first row should show the na */}
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
                                {grade.classRef ? <React.Suspense fallback={<LoaderComp/>}>
                                    <LearnersSuspense classRefId={grade.classRef}/>
                                </React.Suspense>: null}
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
                            {/* <div id="subscriptions" className="col s12">
                                <React.Suspense fallback={
                                    <>
                                        Loading...
                                    </>
                                }>
                                    <SubscriptionsDisplaySuspense/>
                                </React.Suspense>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
        </main>
    )
}

export default GradeDisplayPage