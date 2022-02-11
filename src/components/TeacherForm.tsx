import axios from "axios"
import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext"
import { ITeacherComp } from "../_pages/TeacherDisplayPage";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export interface ITeacher {
    name: string
    email: string
    password: string
    confirmPassword: string
}

// get the current id of the system first then do the stuff
const TeacherFormComp = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(GlobalContext);
    const params = useParams();

    const [teacherDetails, setTeacherDetails] = useState<ITeacher>({
        name: "", email: "", password: "", confirmPassword: ""
    })
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSendingToServer, setIsSendingToServer] = useState(false);
    const [currentTeacherId, setCurrentTeacherId] = useState("");
    const [error, setError] = useState("");
    const [autoGeneratePassword,setAutoGeneratePassword] = useState(true); // by default
    const [updatePasswords, setUpdatePasswords] = useState(false);

    const success_toastify = () => toast.success("Successfully created/updated teacher!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })

    const failure_toastify = (message: string) => toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
        // onClose: () => navigate(-1) // go back to the grades page after a success :)
    })


    useEffect(() => {
        if (params.id) {
            // operation is updating
            setIsUpdating(true);
            axios.get(`/api/teacher/${params.id}`, {
                headers: { 'Authorization': `Bearer ${authToken}`}
            }).then(({ data }) => {
                if (data) {
                    let { name, email, _id } = data.teacher as ITeacherComp

                    setCurrentTeacherId(_id);
                    setTeacherDetails(old => ({
                        ...old,
                        name, email
                    }))
                }
            })
            .catch(error => {
                setError(error.message as string);
            })
        }
    }, []);

    const handleInputValueChange = (e: any) => {
        setTeacherDetails(old => ({
            ...old,
            [e.target.name]: e.target.value
        }))
    }

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        setIsSendingToServer(true)

        axios({
            url: isUpdating? `/api/teacher/${currentTeacherId}`: "/api/teacher/new",
            method: isUpdating ?  "put" : "post",
            data: {
                ...teacherDetails,
                autoGeneratePassword,
                updatePasswords
            },
            headers: {"Authorization": `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data) {
                if (data.status) {
                    return success_toastify();
                }

                setError(data.message as string)
                return failure_toastify(data.message);
            }

            throw new Error("Unexpected error!")
        })
        .catch(error => {
            setError(error.message as string);
        })
        .finally(() => setIsSendingToServer(false));
    }

    return (
        <form className="contactustext" onSubmit={handleFormSubmission} method="POST" encType="multipart/form-data">
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
                <div className="input-field">
                    <div style={{position: "relative", width: "250px", margin: "auto" }}>
                        <img 
                            id="profile-pic-preview"
                            style={{
                                filter:"brightness(50%)",
                                height: "200px",
                                width: "200px",
                                objectFit: "contain",
                                borderRadius: "50%"
                            }}
                            src="https://cdn2.iconfinder.com/data/icons/child-people-face-avatar-3/500/child_152-512.png"/>
                    
                        <div style={{position: "absolute",bottom: "85px",right: "50px"}}>
                            <label
                                htmlFor="profile-pic-upload" 
                                id="profile-pic-label2" 
                                className="sub-modal-texts btn-small waves-effect waves-light"
                            ><i className="material-icons left">camera_alt</i>profile picture</label>
                            {/* onchange="showPreview(event);" */}
                            <input type="file" name="profilePic" id="profile-pic-upload" accept="image/*" style={{display: "none"}} /> 
                        </div>
                    </div>
                </div>

                {/* <!-- end of profile pic upload place --> */}
                <div className="input-field col s6">
                    <input value={teacherDetails.name} onChange={handleInputValueChange} id="first_name" name="name" type="text" className="validate contactustext"/>
                    <label htmlFor="first_name">Full name</label>
                </div>

                <div className="input-field col s6">
                    <input value={teacherDetails.email} onChange={handleInputValueChange} id="last_name" name="email" type="email" className="validate contactustext"/>
                    <label htmlFor="last_name">Email</label>
                </div>

                <div className="input-field col s12 m12 left-align" hidden={!isUpdating}>
                    <p className="sub-modal-texts">
                        <label>
                            <input type="checkbox" className="filled-in" checked={updatePasswords} onChange={e => {
                                setUpdatePasswords(e.target.checked)
                            }} />
                            <span>Change password</span>
                        </label>
                    </p>
                </div>

               <div className="input-field row" hidden={isUpdating && !updatePasswords}>
                    <div className="col s12" style={{
                        border: "1px solid #d3d3d3",
                        borderRadius: "5px"
                    }}>
                    <div className="input-field col s12 m12 left-align">
                    <p className="sub-modal-texts">
                        <label>
                            <input type="checkbox" className="filled-in" checked={autoGeneratePassword} onChange={e => {
                                setAutoGeneratePassword(e.target.checked)
                            }} />
                            <span>Auto generate password</span>
                        </label>
                    </p>
                </div>

                { autoGeneratePassword ? null :
                    <>
                        <div className="input-field col s12 m6">
                            <input value={teacherDetails.password} autoComplete="new-password" onChange={handleInputValueChange} id="password" name="password" type="password" className="validate contactustext"/>
                            <label htmlFor="password">Password</label>
                        </div>

                        <div className="input-field col s12 m6">
                            <input value={teacherDetails.confirmPassword} autoComplete="new-password" onChange={handleInputValueChange} id="confirmPassword" name="confirmPassword" type="password" className="validate contactustext"/>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                    </>
                }
                    </div>
                </div> 

            </div>

            {/* onclick="loaderOverlay();" */}
            <button className={`waves-effect waves-light btn sub-names ${isUpdating ? 'teal' : 'materialize-red'}`} style={{width:"40%"}} type="submit">{isUpdating ? isSendingToServer ? "UPDATING..." : "UPDATE": isSendingToServer ? "CREATING..." : "CREATE"} TEACHER</button>
        </form>
    )
}

export default TeacherFormComp