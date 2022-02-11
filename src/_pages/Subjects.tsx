import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import LoaderComp from "../components/LoaderComp";
import { GlobalContext } from "../contexts/GlobalContext";
import LoaderPage from "./loader";
import { ITeacherComp } from "./TeacherDisplayPage";

interface ISubject {
    _id: string
    name: string
    teacher: ITeacherComp
}

const Subject: React.FC<ISubject> = ({ _id, name, teacher }) => {
    const navigate = useNavigate();

    return (
        <div className="col s12 m4">
            <div 
                onClick={_ => navigate(`/subject/${_id}`)}
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
                        src={`https://www.zoezi-education.com/img/kcpe/${name ? name.split(" ")[0].toLowerCase() : "mathematics"}.png`}
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

const SubjectsComp = () => {
    const { authToken, isTeacher } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [error, setError] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // fetch the subjects in this grade and then see what it has
    useEffect(() => {
        const classId = localStorage.getItem("classId") || "";
        setIsFetching(true);

        axios.get(`/api/subject/${classId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setSubjects(data.subjects as ISubject[]);
                    return;
                }

                throw new Error("Unexpected error!")
            })
            .catch(error => {
                setError(error.message)
            })
            .finally(() => {
                setIsFetching(false);
            })
    }, []);

    if (isFetching) {
        return <LoaderComp/>
    }

    // display errors and stuff :)
    return (
        <>
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
            <div className="row" hidden={isTeacher}>
                <div className="col s12">
                    <button 
                        onClick={_ => navigate("/subject/new", { replace: true })}
                        className="waves-effect waves-light btn-flat"><i className="material-icons right">add_circle_outline</i>Add Subject</button>
                </div>
            </div>
            <div className="row">
                {subjects.map((subject, index) => {
                    return <Subject key={index} {...subject}/>
                }, { replace: true })}
            </div>
        </>
    )
}

export default SubjectsComp