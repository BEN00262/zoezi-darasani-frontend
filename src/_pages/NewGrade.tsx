import axios from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { GlobalContext } from '../contexts/GlobalContext';
import { ITeacherComp } from './TeacherDisplayPage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export interface ISelectableData {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
}

const NewGrade = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(GlobalContext);
    const [grades, setGrades] = useState<ISelectableData[]>([]);

    const [teachers, setTeachers] = useState<ISelectableData[]>([]);
    const [gradeDetails, setGradeDetails] = useState<{
        grade: string
        teacherId: string
        stream: string
        year: number
    }>({ teacherId: "", grade: "", stream: "", year: (new Date()).getFullYear() })
    const [error, setError] = useState("");
    const [isCreactingGrade, setIsCreatingGrade] = useState(false);

    const success_toastify = () => toast.success("Successfully created grade!", {
        position: toast.POSITION.TOP_RIGHT,
        className: "sub-modal-texts",
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })

    const error_toastify = (message: string) => toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        progress: 0,
        className: "sub-modal-texts",
        autoClose: false
    })


    useEffect(() => {
        Promise.all([
            axios.get("/api/misc/grades", { headers: { 'Authorization': `Bearer ${authToken}`}}),
            axios.get("/api/teacher/all", { headers: { 'Authorization': `Bearer ${authToken}`}})
        ]) 
        .then(([{ data: _grades }, { data }]) => {
            if (_grades) {
                if (_grades.status) {
                    // we have the grades :)
                    setGrades(
                        (_grades.grades as string[]).map((x, index) => ({
                            label: x,
                            value: x,
                            _id: `${index}`
                        }))
                    )
                } else {
                    // there was an error and we need to crush
                    error_toastify("Failed to load grades");
                    return
                }
            }

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

        setIsCreatingGrade(true);
        axios.post("/api/grade", gradeDetails, {
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

                throw new Error("Unexpected error!");
            })
            .catch((error: Error) => {
                setError(error.message);
            })
            .finally(() => setIsCreatingGrade(false));
    }

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
             <div className='container'>
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
                    <form method='post' onSubmit={handleFormSubmission} className="col s12 m6 push-m3">
                        <div className="col s12 m12">
                            {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                            <label>Select Grade</label>
                            <Select
                                onChange={item => {
                                    setGradeDetails(old => ({
                                        ...old,
                                        grade: (item?.value || "")
                                    }))
                                }}
                                options={grades} 
                                placeholder="choose grade..."/>
                            
                        </div>

                        <div className="col s12 m12">
                            <label htmlFor="year">Grade Year</label>
                            <input type="number" value={gradeDetails.year} id='year' onChange={e => {
                                setGradeDetails(old => ({
                                    ...old,
                                    [e.target.name]: e.target.value
                                }))
                            }} name="year"/>
                        </div>

                        <div className="col s12 m12">
                            <label htmlFor="stream">Grade stream</label>
                            <input type="text" id='stream' value={gradeDetails.stream} onChange={e => {
                                setGradeDetails(old => ({
                                    ...old,
                                    [e.target.name]: e.target.value
                                }))
                            }} name="stream"/>
                        </div>

                        {/* attaching to a teacher */}
                        <div className="col s12 m12">
                            {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                            <label>Assign Class Teacher</label>
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
                            marginTop: "10px"
                        }}>
                            <button className="btn-small">{isCreactingGrade ? "Creating Grade..." : "Create Grade"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </main>
    )
}

export default NewGrade