// @ts-ignore
import M from "materialize-css";
import {Link, useParams} from "react-router-dom"
import React, { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../contexts/GlobalContext";
import axios from "axios";
import EditSubject from "./EditSubject";

const SubjectAnalysisCompSuspense = React.lazy(() => import("../components/SubjectAnalysisComp"))

interface ISubjectInformation {
    _id: string
    name: string
    teacher: {
        name: string
        email: string
    }
}

// show the metrics for the subject in a given grade
const SubjectAnalysis = () => {
    const params = useParams();
    const { authToken, isTeacher } = useContext(GlobalContext);
    const [subject, setSubject] = useState<ISubjectInformation>({
        name: "", teacher: { email: "", name: ""}, _id:""
    }); // resolve this here first :) then we can proceed

    useEffect(() => {
        // attach the materialize js stuff :)
        M.Collapsible.init(
            document.querySelectorAll('.collapsible')
        )

        // send the request
        axios.get(`/api/subject/information/${params.id}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => {
            // lets see what gives :)
            if (data) {
                setSubject(data.subject as ISubjectInformation);
                return;
            }
        })

        M.Sidenav.init(document.querySelectorAll('.sidenav'), {
            edge: "right"
        });
    }, [])

    return (
        <main>
            <EditSubject subjectId={subject._id}/>
            <div style={{margin: "0 auto", maxWidth: "1280px", width: "90%"}}>
            <div className="section">
                <div className="row">
                    {/* place the class icon at the top */}
                    <div className="col s12 m2 center sticky-side" style={{
                        borderRight: "1px solid #d3d3d3",
                    }}>
                        <img
                            style={{
                                height: "100px",
                                width: "100px",
                                objectFit: "contain",
                                border: "1px solid #d3d3d3",
                                borderRadius: "50%"
                            }} 
                            src={`https://www.zoezi-education.com/img/kcpe/${subject.name.toLowerCase().split(" ")[0]}.png`}
                        />

                        <ul>
                            <li className="sub-modal-texts" style={{
                                letterSpacing: "1px"
                            }}><b>{subject.name}</b></li>
                            <li className="sub-modal-texts">Subject Teacher: {subject.teacher.name}</li>
                            <li className="sub-modal-texts">Email: {subject.teacher.email}</li>
                        </ul>
                        <div hidden={isTeacher}>
                            <a href="#" data-target="edit-subject" className="waves-effect waves-light btn-flat sidenav-trigger" style={{
                                border: "1px solid teal",
                                borderRadius: "20px"
                            }}>
                                <i className="material-icons right">edit</i>Edit Subject
                            </a>
                            <button className="btn-flat red-text" style={{
                                border: "1px solid red",
                                marginTop: "5px",
                                borderRadius: "20px"
                            }}>
                                <i className="material-icons right">delete</i>Delete Subject
                            </button>
                        </div>
                    </div>

                    {/* select the student and other stuff :) */}
                    <div className="col s12 m10">
                        {/* Dispaly the students on per line ( but now what data will we show ) */}

                        {/* display the charts and other stuffs */}
                        <React.Suspense fallback={<>loading...</>}>
                            <SubjectAnalysisCompSuspense subject={subject.name}/>
                        </React.Suspense>
                    </div>
                </div>

                {/* show the students on the other side of the divide */}
            </div>
        </div>
        </main>
    )
}

export default SubjectAnalysis