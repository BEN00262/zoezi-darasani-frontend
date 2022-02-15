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
import copyText from "copy-to-clipboard";
import { toast } from 'react-toastify'

import { GlobalContext } from "../contexts/GlobalContext";
import LoaderComp from "../components/LoaderComp";
import EmptyComp from "../components/Empty";

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

const success_toast = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

const error_toast = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

const TeacherDisplayPage = () => {
    const { authToken, isTeacher } = useContext(GlobalContext);
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
                        <div className="col s12 m2 center sticky-side" style={{
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
                                    border: "1px solid #d3d3d3",
                                    borderRadius: "20px",
                                    textTransform: "capitalize"
                                }}
                            >
                                <i className="material-icons right">edit</i>Edit Profile
                            </Link>
                            <button className="waves-effect waves-light btn-flat sub-names" style={{
                                    border: "1px solid #d3d3d3",
                                    borderRadius: "20px",
                                    marginTop: "5px",
                                    textTransform: "capitalize"
                            }} onClick={_ => {
                                axios.get(`/api/teacher/credential/${params.id}`, {
                                    headers: { Authorization: `Bearer ${authToken}`}
                                }).then(({ data }) => {
                                    if (data) {
                                        if (data.status) {
                                            copyText(data.decrypted_password);
                                            success_toast("Copied password!")
                                            return;
                                        }

                                        error_toast("Failed to copy password!");
                                        return;
                                    }

                                    throw new Error("Unexpected error!");
                                })
                                .catch(error => {
                                    error_toast(error.message);
                                })
                            }}>
                                <i className="material-icons right">content_copy</i>Copy Password
                            </button>
                        </div>

                        <div className="col s12 m10">
                            <div className="row">
                                <div className="col s12">
                                        <ul className="tabs tabs-fixed-width" style={{
                                            overflowX: "hidden"
                                        }}>
                                            <li className={`tab col s3 ${isTeacher ? teacherDisplay.grades.length ? '': 'disabled' : ''}`}><a href="#mygrades" className={isTeacher ? teacherDisplay.grades.length ? 'active' : '' : 'active'}>My Grade(s)</a></li>
                                            <li className="tab col s3"><a href="#mysubjects" className={isTeacher ? teacherDisplay.grades.length ? '' : 'active' : ''}>My Subject(s)</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row">
                                    <div id="mygrades" className="col s12">
                                        <React.Suspense fallback={<LoaderComp/>}>
                                            {
                                                teacherDisplay.grades.length ?
                                                <TeacherGradesSuspense grades={teacherDisplay.grades}/>
                                                :
                                                <EmptyComp message={isTeacher ? "You have not been assigned any grades. Please contact the school admin" : "No assigned grades"}/>
                                            }
                                        </React.Suspense>
                                    </div>
                                    <div id="mysubjects" className="col s12">
                                        {
                                            teacherDisplay.subjects.length ?
                                            <TeacherSubjectsComp subjects={teacherDisplay.subjects}/>
                                            :
                                            <EmptyComp message={isTeacher ? "You have not been assigned any subjects. Please contact the admin" : "No assigned subjects"}/>
                                        }
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