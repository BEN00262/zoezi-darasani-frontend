import { SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'

import debounce from 'lodash.debounce'
import axios from 'axios';
import { GlobalContext } from '../contexts/GlobalContext';

const success_toast = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

const error_toast = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

interface ISchoolDisplay {
    email: string
    location: string
    mpesaNumber: string
    name: string
    theme: string
    registrationNumber: string
    password: string
    confirmPassword: string
}

const AccountSettings = () => {
    const { authToken } = useContext(GlobalContext);
    const [themePicked, setThemePicked] = useState("#b2dfdb");
    const [isUpdating, setIsUpdating] = useState(false);
    const [schoolDetails, setSchoolDetails] = useState<ISchoolDisplay>({
        email: "", location: "", mpesaNumber: "", name: "", theme: "#b2dfdb", registrationNumber: "",
        password: "", confirmPassword: ""
    })
    const [error, setErrors] = useState("");

    const themePickedUpdateFunction = useMemo(() => debounce(() => {
        axios.put('/api/school/theme', { theme: themePicked }, {
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data && data.status) {
                success_toast("Successfully updated theme!");
                return;
            }

            throw new Error("Failed to update theme!")
        })
        .catch(error => {
            error_toast(error.message);
        })
    }, 3000), [themePicked])

    // useEffect(() => {
    //     themePickedUpdateFunction();
    // }, [themePicked])

    useEffect(() => {
        axios.get("/api/school/profile", {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data && data.school) {
                    let _school = data.school as ISchoolDisplay
                    setSchoolDetails(_school);
                    setThemePicked(_school.theme);
                    return
                }
            })


        return () => {
            themePickedUpdateFunction.cancel();
        }
    }, [])

    const handleInputTextChange = (e:any) => {
        setSchoolDetails(old => ({
            ...old,
            [e.target.name]:e.target.value
        }))
    }

    const handleFormSubmission = (e:SyntheticEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        // redirect to the success page 
        // we just printed what was returned to us ( we need to use it to do other stuff )
        axios.put("/api/school", {
            email: schoolDetails.email,
            mpesaNumber: schoolDetails.mpesaNumber,
            password: schoolDetails.password,
            confirmPassword: schoolDetails.confirmPassword
        }, { headers: { Authorization: `Bearer ${authToken}`} })
            .then(({ data }) => {
                if (data) {
                    if (data.status) {
                        success_toast("Successfully updated school profile");
                        return;
                    }

                    // we have errors from the server for the form ---> we can see them
                    setErrors(data.message);
                }
            })
            .catch(error => {
                error_toast(error.message);
            })
            .finally(() => {
                setIsUpdating(false);
            })
    }


    return (
        <main style={{
            overflowX: "hidden"
        }}>
                <div style={{
                background: themePicked,
                height: "160px",
                position: "relative",
                borderBottom: "1px solid #d3d3d3"
            }}>
                <div className="center">
                    <span style={{
                        fontSize: "60px",
                        letterSpacing: "2px"
                    }} className="sub-names">
                    {schoolDetails.name}
                    </span>
                </div>

                <div style={{
                    position: "relative",
                    left: "20px",
                    // top: "90px"
                }}>
                    <div
                        style={{
                            height: "150px",
                            width: "150px",
                            objectFit: "contain",
                            border: `1px solid ${themePicked}`,
                            borderRadius: "50%",
                            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url('https://illustoon.com/photo/2871.png')"
                        }}
                    ></div>

                    <div style={{
                        position: "absolute",
                        left: "25px",
                        top: "65px"
                    }}>
                        <label htmlFor="profile-upload" className='black-text' style={{
                            border: `3px solid ${themePicked}`,
                            padding: "3px 15px",
                            borderRadius: "20px"
                        }}>
                            update logo
                        </label>
                        <input type="file" id="profile-upload" style={{
                            display: "none"
                        }} />
                    </div>
                </div>
                <div className='right-align' style={{
                    // paddingRight: "5px",
                    position: "absolute",
                    top: "130px",
                    right: "5px"
                    // height: "60px",
                    // display: "flex",
                    // alignItems: "flex-end",
                    // justifyContent: "flex-end"
                }}>
                    <label htmlFor='color-picker' className='blue-text' style={{
                        cursor: "pointer",
                        background: "#d3d3d3",
                        // border: "1px solid #d3d3d3",
                        borderRadius: "20px",
                        padding: "2px 10px",
                    }}>
                        update theme
                    </label>
                    <input id='color-picker' value={themePicked} onChange={e => {
                        setThemePicked(e.target.value)
                    }} style={{
                        display: 'none'
                    }} type="color" />
                </div>
            </div>
            <div className="container">
                    <div className="row">
                       <div className="section">
                       {
                        error ?
                            <div className="row">
                                <div className="col s12">
                                    <div className="sub-modal-texts" style={{
                                        borderLeft: "2px solid red",
                                        paddingLeft: "5px",
                                        borderRadius: "3px",
                                        lineHeight: "4em",
                                        backgroundColor: "rgba(255,0,0, 0.1)",
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}>
                                        <i className="material-icons left">error_outline</i>
                                        {error}
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                       <div className="col s12 m10 push-m1">
                        <form onSubmit={handleFormSubmission} className="contactustext" method="POST">
                            <div className="row">
                                <div className="input-field col s6">
                                    <input value={schoolDetails.name} disabled  required id="first_name" name="name" type="text" className="validate contactustext"/>
                                    <label htmlFor="first_name">Name</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Full names of the school</span>
                                </div>

                                <div className="input-field col s6">
                                    <input value={schoolDetails.registrationNumber} disabled required id="registration_number" name="registrationNumber" type="text" className="validate contactustext"/>
                                    <label htmlFor="registration_number">Registration Number</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">school's registration number</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input onChange={handleInputTextChange} value={schoolDetails.mpesaNumber} required id="mpesa_num" name="mpesaNumber" type="text" className="validate contactustext"/>
                                    <label htmlFor="mpesa_num">Phone Number</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Use a safaricom phone number ( e.g 0725xxxxxx )</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input onChange={handleInputTextChange} value={schoolDetails.email} id="email" required name="email" type="email" className="validate contactustext"/>
                                    <label htmlFor="email">Email</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">* Required</span>
                                </div>

                                <div className="input-field col s12 left-align">
                                    <Select
                                        isDisabled={true}
                                        onChange={item => {
                                            // setSchoolDetails(old => ({
                                            //     ...old,
                                            //     location: (item?.value || "")
                                            // }))
                                        }}
                                        value={{
                                            value: schoolDetails.location,
                                            label: schoolDetails.location
                                        }}
                                        options={[]} 
                                        placeholder="select county..."/>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input  value={schoolDetails.password} id="password" onChange={handleInputTextChange} name="password" type="password" className="validate"/>
                                    <label htmlFor="password">Password</label>
                                    <span className="helper-text left-align" data-error="wrong" data-success="right">Minimum 8 characters</span>
                                </div>

                                <div className="input-field col s12 m6">
                                    <input value={schoolDetails.confirmPassword} id="confirmpassword" onChange={handleInputTextChange} name="confirmPassword" type="password" className="validate"/>
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                </div>
                            </div>

                            <button className="btn sub-names materialize-red" style={{width:"40%"}} type="submit">{isUpdating ? "updating profile..." : "UPDATE"}</button>
                        </form>
                        </div>
                       </div>
                    </div>
            </div>
        </main>
    )
}

export default AccountSettings