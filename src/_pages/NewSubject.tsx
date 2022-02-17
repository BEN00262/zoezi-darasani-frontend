// @ts-ignore
import M from 'materialize-css'

import axios from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { GlobalContext } from '../contexts/GlobalContext';
import { ISelectableData } from './NewGrade';
import { ITeacherComp } from './TeacherDisplayPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

interface ISubjectData {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
}

interface INewSubjectSideNav {
    subjects: ISubjectData[]
    teachers: ISelectableData[]
    isCreactingSubject: boolean
    pushToList: (subject: ISubjectDetail) => void
}

const NewSubjectSideNav: React.FC<INewSubjectSideNav> = ({ 
    subjects, teachers, isCreactingSubject, pushToList
}) => {
    const [subjectDetails, setSubjectDetails] = useState<ISubjectDetail>({ 
        teacherId: "", teacherName: "", subject: "", subjectName: ""
    });

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        // close the side nav here :)
        if (subjectDetails.teacherId || subjectDetails.subject || subjectDetails.subjectName) {
            pushToList(subjectDetails);
            M.Sidenav.getInstance(document.getElementById("new-subject")).close();
            // setSubjectDetails({} as ISubjectDetail);
            return;
        }
    }
    return (
        <div className='sidenav' id="new-subject">
            <div className="section">
               <div className="row">
               <form method='post' onSubmit={handleFormSubmission} className="col s12">
                            <div className="col s12 m12">
                                {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                                <label>Select Subject</label>
                                <Select
                                    onChange={item => {
                                        setSubjectDetails((old: any) => ({
                                            ...old,
                                            subject: item?.value || "",
                                            subjectName: item?.label || ""
                                        }))
                                    }}
                                    options={subjects} 
                                    placeholder="choose subject..."/>
                                
                            </div>
        
                            {/* attaching to a teacher */}
                            <div className="col s12 m12">
                                {/* if a subject has already been created we cant recreate it ( we have to check this ) */}
                                <label>Assign Teacher</label>
                                <Select
                                    onChange={item => {
                                        setSubjectDetails((old: any) => ({
                                            ...old,
                                            teacherId: item?.value || "",
                                            teacherName: item?.label || ""
                                        }))
                                    }}
                                    options={teachers} 
                                    placeholder="choose teacher..."/>
                                
                            </div>
        
                            <div className="col s12 m12" style={{
                                marginTop: "10px"
                            }}>
                                <button className="btn-small" style={{
                                    width: "100%"
                                }}>Create Subject</button>
                            </div>
                    </form>
               </div>
            </div>
        </div>
    )
}

interface ISubjectDetail {
    teacherId: string
    teacherName: string
    subject: string
    subjectName: string
}

const NewSubject = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { authToken } = useContext(GlobalContext);
    const [subjects, setSubjects] = useState<ISubjectData[]>([]);
    const [error, setError] = useState("");
    const [isCreactingSubject, setIsCreatingSubject] = useState(false);

    const [teachers, setTeachers] = useState<ISelectableData[]>([]);

    // this should be an array of this :)
    const [subjectDetails, setSubjectDetails] = useState<ISubjectDetail[]>([]);

    const success_toastify = () => toast.success("Successfully created subject!", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })

    const error_toastify = (message: string) => toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        progress: 0,
        autoClose: false
    })


    useEffect(() => {
        const classId = localStorage.getItem("classId") || "";

        M.Sidenav.init(document.querySelectorAll('.sidenav'), {
            edge: "right"
        });
        
        Promise.all([
            axios.get(`/api/misc/subjects/${params.gradeName}/${classId}`, { headers: { 'Authorization': `Bearer ${authToken}`}}),
            axios.get("/api/teacher/all", { headers: { 'Authorization': `Bearer ${authToken}`}})
        ])
            .then(([{ data: _subjects }, { data }]) => {

                if (_subjects) {
                    if (_subjects.status) {
                        setSubjects(
                            (_subjects.subjects as string[]).map((x, index) => ({
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
                    })))

                    return;
                }

                throw new Error("Unexpected error!");
            })
            .catch((error: Error) => {
                error_toastify(error.message);
            })
    }, []);

    const handleSubjectsCreation = () => {
        // get the current stuff and use it
        const classId = localStorage.getItem("classId") || "";
        setIsCreatingSubject(true);

        // console.log(learnerDetails);
        axios.post(`/api/subject/${classId}`, {
            subjects: subjectDetails.map(x => ({
                subject: x.subject,
                teacherId: x.teacherId
            }))
        }, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    if (data.status) {
                        return success_toastify();
                    }

                    setError(data.error);
                    return;
                }

                throw new Error("Unexpected error!");
            })
            .catch((error: Error) => {
                setError(error.message)
            })
            .finally(() => {
                setIsCreatingSubject(false);
            })
    }

    
    return (
        // style={{display: "flex",justifyContent: "center",alignItems: "center"}}
        <main>
            <NewSubjectSideNav 
                pushToList={(subject: ISubjectDetail) => {
                    setSubjectDetails(old => [
                        ...old,
                        subject
                    ])
                }}
                isCreactingSubject={isCreactingSubject}
                subjects={subjects.filter(x => !subjectDetails.find(y => y.subject === x.value))}
                teachers={teachers}
            />
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
                    {/* @ts-ignore */}
                   <a disabled={isCreactingSubject} href="#" data-target="new-subject" className='btn-flat sub-modal-texts sidenav-trigger' style={{
                       border: "1px solid #d3d3d3"
                   }}>
                    <b>New <i className="material-icons right">add</i></b>
                   </a>
                   <button disabled={isCreactingSubject} onClick={_ => handleSubjectsCreation()} className='btn-flat sub-modal-texts' style={{
                       border: "1px solid #d3d3d3",
                       marginLeft: "5px"
                   }}>
                    <b>Save <i className="material-icons right">save</i></b>
                   </button>
                </div>
                <div className="divider"></div>
                <div className="row">
                <table className='striped sub-modal-texts highlight'>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Teacher</th>
                        <th>Subject</th>
                    </tr>
                    </thead>

                        <tbody>
                        {
                            subjectDetails.map((subjectDetail, index) => {
                                return (
                                    <tr key={`item_${index}`}>
                                        <td>{index + 1}</td>
                                        <td>{subjectDetail.teacherName}</td>
                                        <td>{subjectDetail.subjectName}</td>
                                        <td>
                                            <button className='btn-flat red-text' onClick={_ => {
                                                // remove the item from the subject details
                                                let localCopy = [...subjectDetails];
                                                localCopy.splice(index, 1);
                                                setSubjectDetails(localCopy);
                                            }}>
                                                <b>remove</b>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </main>
    )
}

export default NewSubject