import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderComp from "../components/LoaderComp";

import { GlobalContext } from "../contexts/GlobalContext";
import convertFromJsonToCsvFile from "../utils/jsonTocsv"

export interface ILearners {
    classRefId: string
}

export interface ILearner {
    _id: string
    firstname: string
    lastname: string
    gender: 'boy' | 'girl'
}

const success_toastify = (message: string) => toast.success(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

const failure_toastify = (message: string) => toast.error(message, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 2000
})

const Learner: React.FC<ILearner> = ({ _id, firstname, lastname, gender }) => {
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
                        src="https://cdn2.iconfinder.com/data/icons/child-people-face-avatar-3/500/child_152-512.png"
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
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    // mount slowly
    useEffect(() => {
        axios.get(`/api/grade/learners/${classRefId}`, {
            headers: { 'Authorization': `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    let _learners = data.learners as ILearner[];

                    setLearners(_learners);
                    setLearnersTemp(_learners);
                    return;
                }

                setError("Failed to fetch learners");
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(()=> {
                setIsFetching(false);
            })
    }, []);

    if (isFetching) {
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
                {learners.map((learner, index) => <Learner key={index} {...learner}/>)}
            </div>
        </>
    )
}

export default Learners