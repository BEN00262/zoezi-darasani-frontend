import axios from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { GlobalContext } from '../contexts/GlobalContext';
import { ITeacherComp } from './TeacherDisplayPage';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export interface ISelectableData {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
}

const EditGrade = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(GlobalContext);

    const [teachers, setTeachers] = useState<ISelectableData[]>([]);
    const [gradeDetails, setGradeDetails] = useState<{
        teacherId: string
    }>({ teacherId: "" })
    const [error, setError] = useState("");
    const [isCreactingGrade, setIsCreatingGrade] = useState(false);

    const success_toastify = () => toast.success("Successfully created grade!", {
        position: toast.POSITION.TOP_LEFT,
        autoClose: 1000,
        onClose: () => navigate(0),
        className: "sub-modal-texts"
    })

    const error_toastify = (message: string) => toast.error(message, {
        position: toast.POSITION.TOP_LEFT,
        progress: 0,
        autoClose: false,
        className: "sub-modal-texts"
    })


    useEffect(() => {
      axios.get("/api/teacher/all", { headers: { 'Authorization': `Bearer ${authToken}`}})
        .then(({ data }) => {
            if (data) {
                let _teachers = data.teachers as ITeacherComp[]
                setTeachers(_teachers.map(({ _id, name, email }) => ({
                    label: `${name} | ${email}`,
                    _id, value: _id
                })));

                return;
            }

            throw new Error("Unexpected error!");
        })
        .catch((error: Error) => {
            error_toastify(error.message);
        })
    }, []);


    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        const classId = localStorage.getItem("classId") || "";

        setIsCreatingGrade(true);
        axios.put(`/api/grade/${classId}`, gradeDetails, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
            .then(({ data }) => {
                if (data) {
                    if (data.status) {
                        return success_toastify();
                    }

                    setError(data.message);
                    return;
                }

                // auto close the side nav after saving the data ( :) )

                throw new Error("Unexpected error!");
            })
            .catch((error: Error) => {
                setError(error.message);
            })
            .finally(() => setIsCreatingGrade(false));
    }

    return (
        <div className='sidenav' id="edit-grade">
            <div className="section">
                {
                    error ?
                    <div className="row">
                        <div className="col s12 m6 push-m3">
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
                    <form method='post' onSubmit={handleFormSubmission} className="col s12">
                        {/* attaching to a teacher */}
                        <div className="col s12 m12">
                            {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                            <label>Change Class Teacher</label>
                            <Select
                                isSearchable={true}
                                onChange={item => {
                                    setGradeDetails(old => ({
                                        ...old,
                                        teacherId: (item?.value || "")
                                    }))
                                }}
                                options={teachers} 
                                placeholder="choose teacher..."/>
                            
                        </div>

                        <div className="col s12 m12" style={{
                            marginTop: "10px",
                        }}>
                            <button className="btn-flat" style={{
                                border: "1px solid #d3d3d3",
                                width: "100%"
                            }}><b>{isCreactingGrade ? "Updating Grade..." : "Update Grade"}</b></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditGrade