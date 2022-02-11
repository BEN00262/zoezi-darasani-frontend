// @ts-ignore
import M from 'materialize-css';

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom"
import LibraryViewComp from "../components/LibraryViewComp";
import StudentReport from "../components/StudentReport"
import { GlobalContext } from "../contexts/GlobalContext";
import LoaderPage from './loader';
import LoaderComp from '../components/LoaderComp';

interface IStudent {
    _id: "",
    firstname: string
    lastname: string
    username: string
    lastActive: string
    password: string
}

const StudentAnalysis = () => {
    const { authToken, isTeacher } = useContext(GlobalContext);
    const params = useParams();
    const [student, setStudent] = useState<IStudent>({
        firstname: "", lastname: "", password: "", username: "", lastActive: "never", _id: ""
    })

    // launch on startup ---> fetch the raw data about the student
    useEffect(() => {
        axios.get(`/api/learner/${params.id}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setStudent(data.student as IStudent);
                    return;
                }
            })

        // init the tab stuff
        M.Tabs.init(document.getElementById("student-analysis-tabs"), {
            
        });
    }, []);



    return (
        <main>
            <div className="container">
            <div className="section">
                <div className="row center">
                    {/* place the class icon at the top */}
                    <div style={{
                        margin: "auto"
                    }}>
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
                            }}><b>{student.firstname} {student.lastname}</b></span>
                            <span style={{
                                marginRight: "5px",
                                marginLeft: "5px"
                            }}>|</span>
                            <span className="sub-modal-texts">Last active: {student.lastActive}</span>
                            <br />
                            <br />
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center"
                            }}>
                            <div hidden={isTeacher}>
                                <Link 
                                    to={`/learner/edit/${params.id as string}`} 
                                    className="waves-effect waves-light btn-flat"
                                    style={{
                                        border: "1px solid teal",
                                        borderRadius: "20px"
                                    }}
                                >
                                    <i className="material-icons right">edit</i>Edit Profile
                                </Link>
                            </div>
                            
                            <button
                                className="waves-effect waves-light btn-flat"
                                style={{ 
                                    marginLeft: "5px",
                                    border: "1px solid teal",
                                    borderRadius: "20px"
                                }}
                                onClick={_ => {
                                    const file = new Blob(
                                        [JSON.stringify(
                                            {
                                                firstname: student.firstname,
                                                lastname: student.lastname,
                                                username: student.username,
                                                password: student.password
                                            }
                                        )], 
                                        { type: 'application/json' }
                                    );

                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(file);;
                                    link.setAttribute(
                                        'download', `credentials (${student.firstname} ${student.lastname}).json`
                                    );
                                    document.body.appendChild(link);
                                    link.click();
                                }}
                            >
                                <i className="material-icons right">file_download</i>
                                Credentials
                            </button>
                            </div>
                    </div>
                </div>
                {/* include the entire student library at this point */}
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs tabs-fixed-width" id='student-analysis-tabs'>
                            <li className="tab col s3"><a className="active" href="#reports">Reports</a></li>
                            <li className="tab col s3"><a href="#library">Library</a></li>
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div id="reports">
                        <StudentReport studentId={params.id || ""}/>
                    </div>
                    <div id="library">
                        {
                            student._id ? <LibraryViewComp studentId={student._id}/> : <LoaderComp/>
                        }
                    </div>
                </div>
            </div>
        </div>
        </main>
    )
}

export default StudentAnalysis