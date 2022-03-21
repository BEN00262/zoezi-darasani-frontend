import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import LoaderComp from "../components/LoaderComp";
import {get_learner_avatar} from "../utils/avatar_chooser"

import { GlobalContext } from "../contexts/GlobalContext";
import convertFromJsonToCsvFile from "../utils/jsonTocsv"
import { useQuery } from "react-query";

export interface ILearners {
    classRefId: string | null
}

export interface ILearner {
    _id: string
    firstname: string
    lastname: string
    profilePic: string
    gender: 'boy' | 'girl'
}

const success_toastify = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    className: "sub-modal-texts"
})

const failure_toastify = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000,
    className: "sub-modal-texts"
})

const Learner: React.FC<ILearner> = ({ _id, firstname, lastname, gender, profilePic }) => {
    const navigate = useNavigate();

    return (
        <div className="col s6 m4">
            <div 
                onClick={_ => navigate(`/learner/${_id}`)}
                className="hoverable z-depth-0 hoverable sub-modal-texts" 
                style={{cursor: "pointer", border: "1px solid #d3d3d3",borderRadius: "2px",padding:"5px", marginBottom: "5px"}}>
                <div style={{display: "flex", flexDirection: "row",alignItems: "center"}}>
                    <img
                        style={{
                            height: "100px",
                            width: "100px",
                            objectFit: "contain",
                            border: "1px solid #d3d3d3",
                            borderRadius: "50%"
                        }} 
                        src={profilePic ? profilePic : get_learner_avatar(gender)}
                    />

                    <ul style={{paddingLeft: "20px"}}>
                        <li style={{
                            letterSpacing: "1px"
                        }}><b>{firstname} {lastname}</b></li>
                    </ul>
                    
                </div>
            </div>
        </div>
    )
}

const Learners: React.FC<ILearners> = ({ classRefId }) => {
    const { authToken, isTeacher } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [learners, setLearners] = useState<ILearner[]>([]);
    const [learnersTemp, setLearnersTemp] = useState<ILearner[]>([]);

    const {
        isError, error, isLoading: isFetching, isSuccess, isIdle
    } = useQuery(['in_app_grade_learners', classRefId], () => {
        return axios.get(`/api/grade/learners/${classRefId}`, {
            headers: { 'Authorization': `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    let _learners = data.learners as ILearner[];
                    setLearners(_learners);
                    setLearnersTemp(_learners);
                    return;
                }

                throw new Error("Failed to fetch learners");
            })
    }, {
        enabled: !!authToken && !!classRefId
    })

    // mount slowly
    if (isFetching || isIdle) {
        return <LoaderComp/>
    }

    const handleSearch = (e: any) => {
        let searchTerm = (e.target.value || "").toLowerCase();

        if (!searchTerm) {
            setLearners(learnersTemp);
            return
        }

        setLearners(
            learnersTemp.filter(
                x => x.firstname.toLowerCase().indexOf(searchTerm) > -1 
                || x.lastname.toLowerCase().indexOf(searchTerm) > -1
            )
        )
    }

    return (
        <>
            <div className="row">
                <div className="col s12 m8 left-align">
                    <button disabled={isTeacher} className="waves-effect waves-light btn-flat"
                        style={{
                            marginRight: "5px"
                        }}
                        onClick={_ => navigate("/learner/import")}
                    ><i className="material-icons right">cloud_upload</i>Import Learners</button>
                    <button 
                        style={{
                            marginRight: "5px"
                        }}
                        disabled={isTeacher}
                        className="waves-effect waves-light btn-flat"
                        onClick={_ => navigate("/learner/new")}
                    ><i className="material-icons right">person_add</i>Add Learner</button>

                    {/* exporting the credentials */}
                    <button disabled={!!!learners.length} className="waves-effect waves-light btn-flat"
                        onClick={_ => {
                            // make an axios request to fetch the file
                            const classRefId = localStorage.getItem("classRefId") || "";

                            axios.get(`/api/grade/learners/credentials/${classRefId}`, {
                                headers: { 'Authorization': `Bearer ${authToken}`}
                            })
                                .then(async ({ data }) => {
                                    if (data) {
                                        let status = await convertFromJsonToCsvFile(data,"credentials.xlsx")

                                        if (status) {
                                            success_toastify("Exported leaners credentials successfully!")
                                            return;
                                        }

                                        failure_toastify("Failed to export learners credentials. Please contact zoezi team");
                                    }
                                })
                        }}
                    ><i className="material-icons right">cloud_download</i>Export Credentials</button>
                </div>
                <div className="col s12 m4 right-align">
                    <input type="search" className="browser-default" onChange={handleSearch} style={{
                        border: "1px solid #d3d3d3",
                        borderRadius: "20px",
                        lineHeight: "1px",
                        padding: "5px 10px"
                    }} placeholder="search learner..." />
                </div>
            </div>
            {
                isError ?
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
                            <p>{(error as Error)}</p>
                        </div>
                    </div>
                </div>
                : null
            }
            <div className="row">
                {isSuccess && learners.map((learner, index) => <Learner key={index} {...learner}/>)}
            </div>
        </>
    )
}

export default Learners