// display the students ( and other stuffs )
// if the grade is created the subsequent account is created but we need phone numbers
// now thats funny :) ---> should we restrict the data from the another place or should we lessen the 
// grable ( am sure ntafind a way )
// @ts-ignore
import M from "materialize-css"
import {Link, useParams} from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import TeacherSubjectsComp from "./TeacherSubjects";
import axios from "axios";
import { GlobalContext } from "../contexts/GlobalContext";

const TeacherGradesSuspense = React.lazy(() => import("./TeacherGrades"))

export interface ITeacherComp {
    _id: string
    name: string
    email: string
}

interface ITeacherDisplay {
    grades: any[]
    subjects: any[]
    teacher: ITeacherComp
}

const TeacherDisplayPage = () => {
    const { authToken } = useContext(GlobalContext);
    const params = useParams();

    const [teacherDisplay, setTeacherDisplay] = useState<ITeacherDisplay>({
        grades: [], subjects: [], teacher: { _id: "", email: "", name: ""}
    })


    useEffect(() => {
        M.Tabs.init(document.querySelector(".tabs"), {
            swipeable: true
        })

        axios.get(`/api/teacher/${params.id}`, {
            headers: { 'Authorization': `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data) {
                setTeacherDisplay(data as ITeacherDisplay)
            }
        })

    }, []);

    return (
        <main>
            <div style={{margin: "0 auto", maxWidth: "1280px", width: "90%"}}>
                <div className="section">
                    <div className="row">
                        <div className="col s12 m2">
                            <div className="row center" style={{
                                borderRight: "1px solid #d3d3d3",
                            }}>
                                {/* place the class icon at the top */}
                                <img
                                    style={{
                                        height: "100px",
                                        width: "100px",
                                        objectFit: "contain",
                                        border: "1px solid #d3d3d3",
                                        borderRadius: "50%"
                                    }} 
                                    src="https://cdn2.iconfinder.com/data/icons/child-people-face-avatar-3/500/child_152-512.png"
                                />
                                {/* then the class teacher */}
                                <br />
                                <span className="sub-modal-texts" style={{
                                    letterSpacing: "1px"
                                }}><b>{teacherDisplay.teacher.name}</b></span>
                                <br />
                                <span className="sub-modal-texts" style={{
                                    letterSpacing: "1px"
                                }}>{teacherDisplay.teacher.email}</span>
                                <br/><br/>
                                <Link 
                                    to={`/teacher/edit/${teacherDisplay.teacher._id}`} 
                                    className="waves-effect waves-light btn-flat sub-names"
                                    style={{
                                        border: "1px solid teal",
                                        borderRadius: "20px",
                                        textTransform: "capitalize"
                                    }}
                                >
                                    <i className="material-icons right">edit</i>Edit Profile
                                </Link>
                            </div>
                        </div>

                        <div className="col s12 m10">
                            <div className="row">
                                <div className="col s12">
                                        <ul className="tabs tabs-fixed-width" style={{
                                            overflowX: "hidden"
                                        }}>
                                            <li className="tab col s3"><a href="#mygrades" className="active">My Grade(s)</a></li>
                                            <li className="tab col s3"><a href="#mysubjects">My Subject(s)</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row">
                                    <div id="mygrades" className="col s12">
                                        <React.Suspense fallback={<p>Fetching teacher's grades</p>}>
                                            <TeacherGradesSuspense grades={teacherDisplay.grades}/>
                                        </React.Suspense>
                                    </div>
                                    <div id="mysubjects" className="col s12">
                                        <TeacherSubjectsComp subjects={teacherDisplay.subjects}/>
                                    </div>
                                </div>

                            </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default TeacherDisplayPage