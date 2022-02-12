// @ts-ignore
import M from 'materialize-css';
import axios from 'axios';
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import ProfileSelectorComp from "../components/compound/ProfileSelector"
import RegisterPage from "../components/compound/Register";
import { GlobalContext } from '../../../contexts/GlobalContext';

// for toast displays
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

export interface IFormData {
    firstname: string
    lastname: string
    gender: string
}

export interface IConfiguration {
    default_avatar: {
        src: string
        alt: string
    },
    preloaded_avatars: {
        src: string
        alt: string
    }[]
}

const RegistrationPage = () => {
    const navigate = useNavigate();
    const params = useParams(); // check if we have any stuff ( if we do we are in the edit page :))
    const { authToken } = useContext(GlobalContext);

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSavingLearner, setIsSavingLearner] = useState(false);

    const [configurations, setConfigurations] = useState<IConfiguration>({ 
        default_avatar: { alt: "", src: ""}, preloaded_avatars: [] 
    })


    const [formData, setFormData] = useState<IFormData>({
        firstname: "", gender: "boy", lastname: ""
    });

    useEffect(() => {
        M.Modal.init(document.querySelectorAll('.modal'), {
            outDuration: 500
        });

        // for testing remove afterwards
        setConfigurations(
            {"default_avatar":{"src":"https://www.zoezi-education.com/img/profiles/default.png","alt":"default profile"},"preloaded_avatars":[{"src":"https://www.zoezi-education.com/img/profiles/profile1.png","alt":"avatar 1"},{"src":"https://www.zoezi-education.com/img/profiles/profile2.png","alt":"avatar 2"},{"src":"https://www.zoezi-education.com/img/profiles/profile3.png","alt":"avatar 3"},{"src":"https://www.zoezi-education.com/img/profiles/profile4.png","alt":"avatar 4"},{"src":"https://www.zoezi-education.com/img/profiles/profile5.png","alt":"avatar 5"}]}
        )

        // this is an update operation ( fetch the students profile and populate everything :) )
        if (params.studentId){

            axios.get(`/api/learner/profile/${params.studentId}`, {
                headers: { Authorization: `Bearer ${authToken}`}
            })
                .then(({ data }) => {
                    if (data) {
                        let _student = data.student as { 
                            firstname: string
                            lastname: string
                            profilePic: string
                            gender: "boy" | "girl"
                        } 

                        setFormData(old => ({
                            ...old,
                            firstname: _student.firstname,
                            lastname: _student.lastname,
                            gender: _student.gender
                        }))
                    }
                })
        }

        
        // download the image configuration and use it
        // axios.get("https://www.zoezi-education.com/fetch-profile-configurations")
        //     .then(({ data }) => {
        //         if (data) { setConfigurations(data) }
        //     })

    }, []);

    const success_toastify = () => toast.success("Successfully created learner!", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        setIsSavingLearner(true);

        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => form.set(key, value));

        if (profileImage) {
            form.set("profilePic", profileImage, profileImage.name);
        }

        // get the current stuff and use it
        const classId = localStorage.getItem("classId") || "";
        const classRefId = localStorage.getItem("classRefId") || "";

        if (params.studentId) {
            return; // we wont save stuff for now
        }

        axios.post(`/api/learner/${classId}/${classRefId}`, form, {
            headers: { 
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(({ data }) => {
                    if (data) {
                        if (data.status) {
                            return success_toastify();
                        }
                        setErrors(data.errors)
                    }
            }).finally(() => setIsSavingLearner(false))
    }

    const handleProfileImageSet = (file: File) => {
        setProfileImage(file);
        M.Modal.getInstance(document.getElementById("profile-modal")).close();
    }

    const handleTextInputChange = (e: any) => {
        setFormData(old => ({
            ...old,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <main>
            <div className="container">
                <div className="section">
                    <div className="row center">
                        <ToastContainer/>
                        {
                            errors.map((error, index) => {
                                return <p className="materialize-red-text" key={`error_${index}`}>{error}</p>
                            } )
                        }
                        <ProfileSelectorComp 
                            passSelectedFileToParent={handleProfileImageSet}
                            configuration={configurations}
                        /> 
                        <RegisterPage
                                configuration={configurations}
                                isSavingLearner={isSavingLearner}
                                formData={formData}
                                handleFormSubmission={handleFormSubmission}
                                handleTextInputChange={handleTextInputChange}
                                profile={profileImage}
                            />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default RegistrationPage