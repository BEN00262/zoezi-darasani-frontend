import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { GlobalContext } from "../contexts/GlobalContext";
import LoaderPage from "./loader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import convertFromJsonToCsvFile from "../utils/jsonTocsv"

interface ITeacher {
    _id: string
    name: string
    email: string
}

const success_toastify = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

const failure_toastify = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

const Teacher: React.FC<ITeacher> = ({ name, email, _id }) => {
    const navigate = useNavigate();

    return (
        <div className="col s12 m4">
            <div 
                onClick={_ => navigate(`/teacher/${_id}`)}
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
                        src="https://cdn2.iconfinder.com/data/icons/child-people-face-avatar-3/500/child_152-512.png"
                    />

                    <ul style={{paddingLeft: "20px"}}>
                        <li style={{
                            letterSpacing: "1px"
                        }}><b>{name}</b></li>
                        <li className="sub-modal-texts" style={{
                            letterSpacing: "1px"
                        }}>{email}</li>
                    </ul>
                    
                </div>
            </div>
        </div>
    )
}

const Teachers = () => {
    // fetch the teachers
    const { authToken } = useContext(GlobalContext);
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [teachersTemp, setTeachersTemp] = useState<ITeacher[]>([]);
    // const [searchTerm, setSearchTerm] = useState("");

    // fetch on render 
    useEffect(() => {
        axios.get("/api/teacher/all", {
            headers: { "Authorization": `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setTeachers(data.teachers);
                    setTeachersTemp(data.teachers);
                }
            })
    }, []);

    const handleSearch = (e: any) => {
        let searchTerm = (e.target.value || "").toLowerCase();

        if (!searchTerm) {
            setTeachers(teachersTemp);
            return
        }

        setTeachers(
            teachersTemp.filter(
                x => x.name.toLowerCase().indexOf(searchTerm) > -1 
                || x.email.toLowerCase().indexOf(searchTerm) > -1
            )
        )
    }

    if (!teachersTemp.length) {
        return <LoaderPage/>
    }

    return (
        <main>
            <div className="container">
                <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                <h5 className="center sub-sub-headings">Teachers</h5>
                <div className="divider"></div>
                <div className="section">
                    <div className="row">
                        <div className="col s12 m8 left-align sub-modal-texts">
                            <Link to="/teacher/import" style={{
                                marginRight: "10px",
                                border: "1px solid #d3d3d3"
                            }} className="waves-effect waves-light btn-flat">
                                <b><i className="material-icons right">cloud_upload</i>Import Teacher(s)</b>
                            </Link>
                            <Link to="/teacher/new" className="waves-effect waves-light btn-flat" style={{
                                border: "1px solid #d3d3d3",
                                marginRight: "10px",
                            }}>
                                <b><i className="material-icons right">add_circle_outline</i>Add Teacher</b>
                            </Link>

                            <button className="waves-effect waves-light btn-flat sub-modal-texts" onClick={_ => {
                                axios.get("/api/teacher/export/credentials", {
                                    headers: { Authorization: `Bearer ${authToken}`}
                                }).then(async ({ data }) => {
                                    let status = await convertFromJsonToCsvFile(data,"teachers_credentials.xlsx")

                                        if (status) {
                                            success_toastify("Exported teachers credentials successfully!")
                                            return;
                                        }

                                        failure_toastify("Failed to export learners credentials. Please contact zoezi team");
                                })
                            }} style={{
                                border: "1px solid #d3d3d3",
                            }}>
                                <b><i className="material-icons right">cloud_download</i>Export credentials</b>
                            </button>
                        </div>
                        <div className="col s12 m4 right-align">
                            <input type="search" className="browser-default" onChange={handleSearch} style={{
                                border: "1px solid #d3d3d3",
                                borderRadius: "20px",
                                lineHeight: "1px",
                                padding: "5px 10px"
                            }} placeholder="search teacher..." />
                        </div>
                    </div>
                    <div className="row">
                        {
                            teachers.length ?
                            <>
                                {teachers.map((teacher, index) => {
                                    return <Teacher key={index} {...teacher}/>
                                })}   
                            </> : 

                            <p className="center sub-modal-texts">
                                <b>There arent any teachers</b>
                            </p>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Teachers