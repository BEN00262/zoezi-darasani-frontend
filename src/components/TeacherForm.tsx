import axios from "axios"
import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext"
import { ITeacherComp } from "../_pages/TeacherDisplayPage";

import { ToastContainer, toast } from 'react-toastify';
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
    const [currentTeacherId, setCurrentTeacherId] = useState("");

    const success_toastify = () => toast.success("Successfully imported learner(s)!", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => navigate(-1) // go back to the grades page after a success :)
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

        axios({
            url: isUpdating? `/teacher/${currentTeacherId}`: "/teacher/new",
            method: isUpdating ?  "put" : "post",
            data: teacherDetails,
            headers: {"Authorization": `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data) {
                if (data.status) {
                    return success_toastify();
                }
            }
        })
    }

    return (
        <form className="contactustext" onSubmit={handleFormSubmission} method="POST" encType="multipart/form-data">
            <div className="row">
                <ToastContainer/>
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

                <div className="input-field col s12 m6">
                    <input value={teacherDetails.password} onChange={handleInputValueChange} id="grade_id" name="password" type="password" className="validate contactustext"/>
                    <label htmlFor="grade_id">Password</label>
                    {/* <!-- <span className="helper-text left-align" data-error="wrong" data-success="right">Use a valid Safaricom phone number</span> --> */}
                </div>

                <div className="input-field col s12 m6">
                    <input value={teacherDetails.confirmPassword} onChange={handleInputValueChange} id="school_id" name="confirmPassword" type="password" className="validate contactustext"/>
                    <label htmlFor="school_id">Confirm Password</label>
                </div>

            </div>

            {/* onclick="loaderOverlay();" */}
            <button className={`waves-effect waves-light btn sub-names ${isUpdating ? 'teal' : 'materialize-red'}`} style={{width:"40%"}} type="submit">{isUpdating ? "UPDATE": "ADD"} TEACHER</button>
        </form>
    )
}

export default TeacherFormComp