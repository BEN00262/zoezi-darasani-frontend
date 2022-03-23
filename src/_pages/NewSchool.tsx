import axios from "axios";
import Select from 'react-select';
import { SyntheticEvent, useState } from "react";
import Counties from "../utils/counties"; 
import { Link } from "react-router-dom";
import ApplicationSuccessPage from "./ApplicationSuccessPage";
import { useMutation } from "react-query";

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
    const [schoolDetails, setSchoolDetails] = useState<ISchool>({
        email: "", location: "", mpesaNumber: "", 
        name: "", password: "", confirmPassword: "", registrationNumber: ""
    });

    const [applicationSent, setApplicationSent] = useState(false);

    const new_school_mutation = useMutation(() => {
        return axios.post("/api/school", schoolDetails)
        .then(({ data }) => {
            if (data) {
                if (data.status) { return true }
                throw new Error(data.message);
            }

            throw new Error("Unexpected error!");
        })
    }, {
        onSuccess: (sentForReview, variables, context) => {
            setApplicationSent(sentForReview);
        }
    })

    const handleInputTextChange = (e:any) => {
        setSchoolDetails(old => ({
            ...old,
            [e.target.name]:e.target.value
        }))
    }

    const handleFormSubmission = (e:SyntheticEvent) => {
        e.preventDefault();
        new_school_mutation.mutate();
    }

    if (applicationSent) {
        return <ApplicationSuccessPage/>
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
                           new_school_mutation.isError ?
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
                                                <p>{(new_school_mutation.error as Error).message}</p>
                                            </div>
                                        </div>
                                    </div>
                            : null
                        }

                        <form onSubmit={handleFormSubmission} className="contactustext" method="POST">
                            <div className="row">
                                <div className="input-field col s6">
                                    <input disabled={new_school_mutation.isLoading} value={schoolDetails.name} required id="first_name" name="name" onChange={handleInputTextChange} type="text" className="validate contactustext"/>
                                    <label htmlFor="first_name">Name</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Full names of the school</span>
                                </div>

                                <div className="input-field col s6">
                                    <input disabled={new_school_mutation.isLoading} value={schoolDetails.registrationNumber} required id="registration_number" name="registrationNumber" onChange={handleInputTextChange} type="text" className="validate contactustext"/>
                                    <label htmlFor="registration_number">Registration Number</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">school's registration number</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input disabled={new_school_mutation.isLoading} value={schoolDetails.mpesaNumber} required id="mpesa_num" name="mpesaNumber" type="text" onChange={handleInputTextChange} className="validate contactustext"/>
                                    <label htmlFor="mpesa_num">Phone Number</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Use a safaricom phone number ( e.g 0725xxxxxx )</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input disabled={new_school_mutation.isLoading} id="email" value={schoolDetails.email} required name="email" type="email" onChange={handleInputTextChange} className="validate contactustext"/>
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
                                    <input disabled={new_school_mutation.isLoading} id="password" required value={schoolDetails.password} name="password" type="password" onChange={handleInputTextChange} className="validate"/>
                                    <label htmlFor="password">Password</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Minimum 8 characters</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input disabled={new_school_mutation.isLoading} id="confirmpassword" required value={schoolDetails.confirmPassword} name="confirmPassword" onChange={handleInputTextChange} type="password" className="validate"/>
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                </div>
                            </div>

                            <p className="sub-modal-texts"><small>By creating an account, you agree to Zoezi <a href="/termsofuse">Terms of Use</a> and <a href="/privacynotice">Privacy Notice.</a></small></p>

                            <button className="btn sub-names materialize-red" style={{width:"40%"}} type="submit">{new_school_mutation.isLoading ? "sending application..." : "REGISTER"}</button>

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