import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil";
import LoaderComp from "../components/LoaderComp";
import { GlobalContext } from "../contexts/GlobalContext";
import { classIdState, gradeNameState } from "./GradeDisplayPage";
import { ITeacherComp } from "./TeacherDisplayPage";

interface ISubject {
    _id: string
    name: string
    teacher: ITeacherComp,
    gradeName: string
}

// get the grade name and use it ( unless its kcpe ofcourse )
const Subject: React.FC<ISubject> = ({ _id, name, teacher, gradeName }) => {
    const navigate = useNavigate();
    let _gradeName = gradeName.toLowerCase();
    let _name = name.toLowerCase();

    const imageUrl = _gradeName === "eight" ? "kcpe" : _gradeName;
    const subjectImageUrl = _name === "sst&cre" ? "social" : _name.split(" ")[0];

    return (
        <div className="col s12 m4">
            <div 
                onClick={_ => navigate(`/subject/${_id}`)}
                className="hoverable z-depth-0" 
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
                        src={`https://www.zoezi-education.com/img/${imageUrl}/${subjectImageUrl}.png`}
                    />

                    <ul style={{paddingLeft: "20px"}}>
                        <li>{name}</li>
                        <li className="sub-modal-texts">{teacher.name}</li>
                        <li className="sub-modal-texts">{teacher.email}</li>
                        {/* <li class="sub-modal-texts">Active: <%=child.lastActive%></li> */}
                    </ul>
                    
                </div>
            </div>
        </div>
    )
}

const SubjectsComp: React.FC<{ gradeName: string }> = ({ gradeName }) => {
    const { authToken, isTeacher } = useContext(GlobalContext);
    const navigate = useNavigate();
    const _gradeName = useRecoilValue(gradeNameState);
    const _classId = useRecoilValue(classIdState);

    const {
        isLoading: isFetching, isIdle,
        isError, error, data: subjects, isSuccess
    } = useQuery(['in_app_grade_subjects', _classId], () => {
        return axios.get(`/api/subject/${_classId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) { return data.subjects as ISubject[] }
                throw new Error("Unexpected error!")
            })
    }, {
        enabled: !!authToken && !!_classId,
        staleTime: 60 * 1000 * 1
    })


    if (isFetching || isIdle) {
        return <LoaderComp/>
    }

    // display errors and stuff :)
    return (
        <>
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
            <div className="row" hidden={isTeacher}>
                <div className="col s12">
                    <button 
                        onClick={_ => {
                            if (_gradeName) {
                                return navigate(`/subject/new/${_gradeName}`)
                            }
                        }}
                        className="waves-effect waves-light btn-flat"><i className="material-icons right">add_circle_outline</i>Add Subject(s)</button>
                </div>
            </div>
            <div className="row">
                {isSuccess && (subjects || []).map((subject, index) => {
                    return <Subject key={index} {...subject} gradeName={gradeName}/>
                })}
            </div>
        </>
    )
}

export default SubjectsComp