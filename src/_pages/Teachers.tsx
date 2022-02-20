import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { GlobalContext } from "../contexts/GlobalContext";
import LoaderPage from "./loader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultMaleTeacher from "../img/male_teacher.png"

import convertFromJsonToCsvFile from "../utils/jsonTocsv"
import EmptyComp from "../components/Empty";

interface ITeacher {
    _id: string
    name: string
    email: string
    profilePic: string
}

const success_toastify = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    className: "sub-modal-texts"
})

const failure_toastify = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    className: "sub-modal-texts"
})

const Teacher: React.FC<ITeacher> = ({ name, email, _id, profilePic }) => {
    const navigate = useNavigate();

    return (
        <div className="col s12 m4">
            <div 
                onClick={_ => navigate(`/teacher/${_id}`)}
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
                        src={profilePic ? profilePic : DefaultMaleTeacher}
                    />

                    <div className="sub-modal-texts truncate" style={{
                        marginLeft: "20px"
                    }}>
                            <div style={{
                            letterSpacing: "1px"
                        }}><b>{name}</b></div>
                        <div>
                            {email}
                        </div>
                    </div>
                    
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
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");
    // const [searchTerm, setSearchTerm] = useState("");

    // fetch on render 
    useEffect(() => {
        setIsFetching(true);

        axios.get("/api/teacher/all", {
            headers: { "Authorization": `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setTeachers(data.teachers);
                    setTeachersTemp(data.teachers);
                    return;
                }

                throw new Error("Unexpected error!")
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setIsFetching(false);
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

    if (isFetching) {
        return <LoaderPage/>
    }

    return (
        <main>
            <div className="container">
                <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                <h5 className="center sub-sub-headings">TEACHERS</h5>
                <div className="divider"></div>
                <div className="section">
                    {
                        error ?
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
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                        : null
                    }
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

                            <button className="waves-effect waves-light btn-flat sub-modal-texts" disabled={!!!teachersTemp.length} onClick={_ => {
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

                            <EmptyComp message="There aren't any teachers"/>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Teachers