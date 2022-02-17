import { SyntheticEvent, useState } from "react"
import { IConfiguration, IFormData } from "../../pages/RegistrationPage"
// import { default_avatar } from "../../preloaded-avatas"

export interface IRegisterPage {
    handleFormSubmission: (e: SyntheticEvent) => void
    handleTextInputChange: (e: any) => void
    formData: IFormData
    profile: File | null
    isSavingLearner: boolean
    configuration: IConfiguration
    isUpdating: boolean
    handleChangePassword: (status: boolean) => void
}

const RegisterPage: React.FC<IRegisterPage> = ({ 
    handleFormSubmission, handleTextInputChange, formData, profile, isSavingLearner, configuration,
    isUpdating, handleChangePassword
}) => {
    return (
        // enctype="multipart/form-data"
        <div className="col s12 l8 push-l2">
                <form className="contactustext" method="POST" onSubmit={handleFormSubmission}>
            <div className="row">
                {/* <!-- profile pic upload place --> */}
                <div className="input-field">
                    <div style={{position: "relative",width: "250px",margin: "auto"}}>
                        <img 
                            id="profile-pic-preview"
                            alt={configuration.default_avatar.alt}
                            style={{
                                filter: "brightness(50%)",
                                height: "200px",
                                width: "200px",
                                objectFit: "contain",
                                borderRadius: "50%"
                            }}
                            src={profile ? window.URL.createObjectURL(profile): configuration.default_avatar.src}/>
                    
                        <div style={{position: "absolute",bottom: "85px",right: "45px"}}>
                            <a href="#profile-modal" style={{
                                    border: "2px solid #26a69a",
                                    backgroundColor: "#26a69a",
                                    padding: "5px",
                                    paddingLeft: "20px",
                                    paddingRight: "20px",
                                    borderRadius: "20px",
                                    color: "#26a69a"
                                }} className="sub-modal-texts modal-trigger">
                                <i className="material-icons left">camera_alt</i>
                                <span className="white-text"><b>Upload Picture</b></span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* <!-- end of profile pic upload place --> */}
                <div className="input-field col s6">
                    <input onChange={handleTextInputChange} value={formData.firstname} id="first_name" name="firstname" type="text" className="validate contactustext"/>
                    <label htmlFor="first_name">First Name</label>
                </div>

                <div className="input-field col s6">
                    <input onChange={handleTextInputChange} value={formData.lastname} id="last_name" name="lastname" type="text" className="validate contactustext"/>
                    <label htmlFor="last_name">Last Name</label>
                </div>

                <div className="input-field col s12 m12">
                    Select Gender
                    <p>
                        <label>
                        <input onChange={handleTextInputChange} className="with-gap" name="gender" type="radio" value="boy" checked />
                        <span>Boy</span>
                        </label>

                        <label>
                            <input onChange={handleTextInputChange} className="with-gap" name="gender" value="girl" type="radio" />
                            <span>Girl</span>
                        </label>
                    </p>
                </div>

                <div className="input-field col s12 m12" hidden={!isUpdating}>
                    <span className="sub-modal-texts">
                        <label>
                            <input type="checkbox" name="regeneratePassword" className="filled-in" /*checked={updatePasswords}*/ onChange={e => {
                                handleChangePassword(e.target.checked)
                            }} />
                            <span>Update Password</span>
                        </label>
                    </span>
                </div>

            </div>

            <button disabled={isSavingLearner} className={`waves-effect waves-light btn sub-names ${isUpdating ? "teal" : "materialize-red"}`} style={{width:"40%"}}>
                {isSavingLearner ? isUpdating ? "UPDATING..." : "SAVING..." : isUpdating ? "UPDATE LEARNER": "ADD LEARNER"}
            </button>
        </form>
        </div>
    )
}

export default RegisterPage