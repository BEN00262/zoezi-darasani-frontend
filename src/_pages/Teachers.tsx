import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import { GlobalContext } from "../contexts/GlobalContext";
import LoaderPage from "./loader";

interface ITeacher {
    _id: string
    name: string
    email: string
}

const Teacher: React.FC<ITeacher> = ({ name, email, _id }) => {
    const navigate = useNavigate();

    return (
        <div className="col s12 m4">
            <div 
                onClick={_ => navigate(`/teacher/${_id}`)}
                className="hoverable z-depth-1" 
                style={{cursor: "pointer", border: "1px solid #d3d3d3",borderRadius: "2px",padding:"5px"}}>
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

    // fetch on render 
    useEffect(() => {
        axios.get("/api/teacher/all", {
            headers: { "Authorization": `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setTeachers(data.teachers)
                }
            })
    }, []);

    if (!teachers.length) {
        return <LoaderPage/>
    }

    return (
        <main>
            <Link to="/teacher/new" style={{
                    position: "fixed",
                    bottom: "50px",
                    right: "20px"
                }} className="waves-effect waves-light btn-small">
                <i className="material-icons right">add_circle_outline</i>Add Teacher
            </Link>

            <div className="container">
                <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                <h5 className="center sub-sub-headings">Teachers</h5>
                <div className="divider"></div>
                <div className="section">
                    <div className="row">
                        {teachers.map((teacher, index) => {
                            return <Teacher key={index} {...teacher}/>
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Teachers