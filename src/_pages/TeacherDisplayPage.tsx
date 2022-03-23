// display the students ( and other stuffs )
// if the grade is created the subsequent account is created but we need phone numbers
// now thats funny :) ---> should we restrict the data from the another place or should we lessen the 
// grable ( am sure ntafind a way )
// @ts-ignore
import M from "materialize-css"
import {Link, useParams} from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import copyText from "copy-to-clipboard";
import { toast } from 'react-toastify'

import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext";
import LoaderComp from "../components/LoaderComp";
import EmptyComp from "../components/Empty";
import Skeleton from "react-loading-skeleton";
import DefaultMaleTeacher from "../img/male_teacher.png"
import { useQuery } from "react-query";
import { atom, useSetRecoilState } from "recoil";

const TeacherGradesSuspense = React.lazy(() => import("./TeacherGrades"));
const TeacherSubjectsComp = React.lazy(() => import("./TeacherSubjects"));

export interface ITeacherComp {
    _id: string
    name: string
    email: string
    profilePic: string
}

interface ITeacherDisplay {
    grades: any[]
    subjects: any[]
    teacher: ITeacherComp
}

const success_toast = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    className: "sub-modal-texts"
})

const error_toast = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    className: "sub-modal-texts"
});

// set only in teacher display mode
export const baseTeacherLinkState = atom<string | null>({
    key: 'baseTeacherLinkStateId',
    default: null
});

export const isTeacherDisplayLinkExposedState = atom({
    key: 'isTeacherDisplayLinkExposedStateId',
    default: { myGrades: false, mySubjects: false }
});

const TeacherDisplayPage = () => {
    const { authToken, isTeacher } = useGlobalZoeziTrackedState();
    const params = useParams();

    const [teacherDisplay, setTeacherDisplay] = useState<ITeacherDisplay>({
        grades: [], subjects: [], teacher: { _id: "", email: "", name: "", profilePic: ""}
    });

    const setBaseTeacherLinkState = useSetRecoilState(baseTeacherLinkState);
    const setIsTeacherDisplayLinkExposedState = useSetRecoilState(isTeacherDisplayLinkExposedState);

    const {
        isLoading, isError, error, data, isSuccess, isIdle
    } = useQuery(['in_app_school_teacher_display', params.id], () => {
        return axios.get(`/api/teacher/${params.id}`, {
            headers: { 'Authorization': `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data) { return (data as ITeacherDisplay) }
            throw new Error("Unexpected error!");
        })
    }, {
        enabled: !!authToken && !!params.id,
        staleTime: 60 * 1000 // cache for 1 minute
    })

    useEffect(() => {
        if (isSuccess && data) {
            setTeacherDisplay(data);

            // for the links on a teacher display account :)
            setBaseTeacherLinkState(isTeacher ? (params.id || null) : null);
            setIsTeacherDisplayLinkExposedState({
                myGrades: isTeacher ? !!data.grades.length : false,
                mySubjects: isTeacher ? !!data.subjects.length : false
            });


            M.Tabs.init(document.querySelector(".tabs"), {})  
        }
    }, [isSuccess]);

    return (
        <main>
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
                            {/* place the class icon at the top */}
                            <img
                                style={{
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "contain",
                                    border: "1px solid #d3d3d3",
                                    borderRadius: "50%"
                                }} 
                                src={teacherDisplay.teacher.profilePic ? teacherDisplay.teacher.profilePic : DefaultMaleTeacher}
                            />
                            {/* then the class teacher */}
                            <br />
                            <span className="sub-modal-texts" style={{
                                letterSpacing: "1px"
                            }}><b>{teacherDisplay.teacher.name ? teacherDisplay.teacher.name : <Skeleton/>}</b></span>
                            <br />
                            <span className="sub-modal-texts" style={{
                                letterSpacing: "1px"
                            }}>{teacherDisplay.teacher.email ? teacherDisplay.teacher.email : <Skeleton/>}</span>
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
                           {
                               isLoading || isIdle ? <LoaderComp/>
                                :
                                <>
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
                                                    isSuccess && teacherDisplay.grades.length ?
                                                    <TeacherGradesSuspense grades={teacherDisplay.grades}/>
                                                    :
                                                    <EmptyComp message={isTeacher ? "You have not been assigned any grades. Please contact the school admin" : "No assigned grades"}/>
                                                }
                                            </React.Suspense>
                                        </div>
                                        <div id="mysubjects" className="col s12">
                                            <React.Suspense fallback={<LoaderComp/>}>
                                                {
                                                    isSuccess && teacherDisplay.subjects.length ?
                                                    <TeacherSubjectsComp subjects={teacherDisplay.subjects}/>
                                                    :
                                                    <EmptyComp message={isTeacher ? "You have not been assigned any subjects. Please contact the admin" : "No assigned subjects"}/>
                                                }
                                            </React.Suspense>
                                        </div>
                                    </div>
                                </>
                           }
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default TeacherDisplayPage