import axios from "axios";
import Select from 'react-select';
import { SyntheticEvent, useState } from "react";
import Counties from "../utils/counties"; 
import { Link, useNavigate } from "react-router-dom";

export interface ISchool {
    name: string
    location: string
    registrationNumber: string
    email: string
    mpesaNumber: string
    password: string
    confirmPassword: string
}

const NewSchool = () => {
    const navigate = useNavigate();
    // able to create a new school
    const [schoolDetails, setSchoolDetails] = useState<ISchool>({
        email: "", location: "", mpesaNumber: "", 
        name: "", password: "", confirmPassword: "", registrationNumber: ""
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleInputTextChange = (e:any) => {
        setSchoolDetails(old => ({
            ...old,
            [e.target.name]:e.target.value
        }))
    }

    const handleFormSubmission = (e:SyntheticEvent) => {
        e.preventDefault();
        setIsRegistering(true);

        // redirect to the success page 
        // we just printed what was returned to us ( we need to use it to do other stuff )
        axios.post("/api/school", schoolDetails)
            .then(({ data }) => {
                if (data) {
                    if (data.status) {
                        // we have created a school successfully 
                        // redirect to the success page :)
                        return navigate("/application/success", { replace: true })
                    }

                    // we have errors from the server for the form ---> we can see them
                    setErrors([data.message]);
                }
            })
            .finally(() => {
                setIsRegistering(false);
            })
    }

    return (
        <main>
                <div className="container">
        <div className="section">

            <div className="row center">

                <div className="col s12">
                    <h3><i className="mdi-content-send brown-text"></i></h3>
                    <h5 className="sub-names">Sign Up</h5>
                </div>

                <div className="col s12 l8 push-l2">
                        {
                            errors.map((error, index) => {
                                return <p key={`error_${index}`} className="materialize-red-text">
                                        {error}
                                    </p>
                            })
                        }

                        <form onSubmit={handleFormSubmission} className="contactustext" method="POST">
                            <div className="row">
                                <div className="input-field col s6">
                                    <input disabled={isRegistering} value={schoolDetails.name} required id="first_name" name="name" onChange={handleInputTextChange} type="text" className="validate contactustext"/>
                                    <label htmlFor="first_name">Name</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Full names of the school</span>
                                </div>

                                <div className="input-field col s6">
                                    <input disabled={isRegistering} value={schoolDetails.registrationNumber} required id="registration_number" name="registrationNumber" onChange={handleInputTextChange} type="text" className="validate contactustext"/>
                                    <label htmlFor="registration_number">Registration Number</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">school's registration number</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input disabled={isRegistering} value={schoolDetails.mpesaNumber} required id="mpesa_num" name="mpesaNumber" type="text" onChange={handleInputTextChange} className="validate contactustext"/>
                                    <label htmlFor="mpesa_num">Phone Number</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Use a safaricom phone number ( e.g 0725xxxxxx )</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input disabled={isRegistering} id="email" value={schoolDetails.email} required name="email" type="email" onChange={handleInputTextChange} className="validate contactustext"/>
                                    <label htmlFor="email">Email</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">* Required</span>
                                </div>

                                <div className="input-field col s12 left-align">
                                    <Select
                                        onChange={item => {
                                            setSchoolDetails(old => ({
                                                ...old,
                                                location: (item?.value || "")
                                            }))
                                        }}
                                        options={Counties} 
                                        placeholder="select county..."/>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input disabled={isRegistering} id="password" required value={schoolDetails.password} name="password" type="password" onChange={handleInputTextChange} className="validate"/>
                                    <label htmlFor="password">Password</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Minimum 8 characters</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input disabled={isRegistering} id="confirmpassword" required value={schoolDetails.confirmPassword} name="confirmPassword" onChange={handleInputTextChange} type="password" className="validate"/>
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                </div>
                            </div>

                            <p className="sub-modal-texts"><small>By creating an account, you agree to Zoezi <a href="/termsofuse">Terms of Use</a> and <a href="/privacynotice">Privacy Notice.</a></small></p>

                            <button className="btn sub-names materialize-red" style={{width:"40%"}} type="submit">{isRegistering ? "sending application..." : "REGISTER"}</button>

                            <p className="sub-modal-texts"><b>Already have an account?<Link to="/login"> Login</Link></b></p>
                        </form>
                </div>
            </div>
        </div>
    </div>
        </main>
    )
}

export default NewSchool