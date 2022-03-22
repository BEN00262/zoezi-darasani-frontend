// @ts-ignore
import M from 'materialize-css';
import axios from 'axios';
import { SyntheticEvent, useEffect, useState } from "react";
import ProfileSelectorComp from "../components/compound/ProfileSelector"
import RegisterPage from "../components/compound/Register";
import { useGlobalZoeziTrackedState } from '../../../contexts/GlobalContext';

// for toast displays
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { ZoeziQueryClient } from '../../../utils/queryclient';
import { useRecoilValue } from 'recoil';
import { classIdState, classRefIdState } from '../../GradeDisplayPage';

export interface IFormData {
    firstname: string
    lastname: string
    gender: string
    regeneratePassword: boolean
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
    const { authToken } = useGlobalZoeziTrackedState();

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSavingLearner, setIsSavingLearner] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const classId = useRecoilValue(classIdState);
    const classRefId = useRecoilValue(classRefIdState);

    const [configurations, setConfigurations] = useState<IConfiguration>({ 
        default_avatar: { alt: "", src: ""}, preloaded_avatars: [] 
    })

    const [formData, setFormData] = useState<IFormData>({
        firstname: "", gender: "boy", lastname: "", regeneratePassword: false
    });

    const handleChangePassword = (status: boolean) => {
        setFormData(old => ({
            ...old,
            regeneratePassword: status
        }))
    }

    useEffect(() => {
        M.Modal.init(document.querySelectorAll('.modal'), {
            outDuration: 500
        });

        // for testing remove afterwards
        setConfigurations(
            {"default_avatar":{"src":"/img/profiles/default.png","alt":"default profile"},"preloaded_avatars":[{"src":"/img/profiles/profile1.png","alt":"avatar 1"},{"src":"/img/profiles/profile2.png","alt":"avatar 2"},{"src":"/img/profiles/profile3.png","alt":"avatar 3"},{"src":"/img/profiles/profile4.png","alt":"avatar 4"},{"src":"/img/profiles/profile5.png","alt":"avatar 5"}]}
        )

        // this is an update operation ( fetch the students profile and populate everything :) )
        if (params.studentId){
            axios.get(`/api/learner/profile/${params.studentId}`, {
                headers: { Authorization: `Bearer ${authToken}`}
            })
                .then(({ data }) => {
                    if (data) {
                        const _student = data.student as { 
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
                        }));

                        setIsUpdating(true);
                        return;
                    }

                    throw new Error("Unexpected error!");
                })
                .catch(error => {
                    setErrors([error.message]);
                })
        }
    }, []);

    const success_toastify = () => toast.success("Successfully created learner!", {
        position: toast.POSITION.TOP_RIGHT,
        className: "sub-modal-texts",
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

        axios({
            url: isUpdating ? `/api/learner/${classId}/${classRefId}/${params.studentId}` : `/api/learner/${classId}/${classRefId}`,
            method: isUpdating ? "put" : "post",
            data: form,
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(({ data }) => {
                if (data) {
                    if (data.status) {
                        ZoeziQueryClient.invalidateQueries(['in_app_grade_learners', classId]);
                        return success_toastify();
                    }
                    setErrors(data.errors)
                    return;
                }

                throw new Error("Unexpected error!");
            })
            .catch(error => {
                setErrors([error.message]);
            })
            .finally(() => setIsSavingLearner(false))
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
                        {
                            errors.map((error, index) => {
                                return (
                                    <div className="row" key={`error_${index}`}>
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
                                )
                            } )
                        }
                        <ProfileSelectorComp 
                            passSelectedFileToParent={handleProfileImageSet}
                            configuration={configurations}
                        /> 
                        <RegisterPage
                                isUpdating={isUpdating}
                                handleChangePassword={handleChangePassword}
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