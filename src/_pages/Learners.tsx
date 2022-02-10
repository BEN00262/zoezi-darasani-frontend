import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                className="hoverable z-depth-1" 
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
    const { authToken } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [learners, setLearners] = useState<ILearner[]>([]);

    // mount slowly
    useEffect(() => {
        axios.get(`/api/grade/learners/${classRefId}`, {
            headers: { 'Authorization': `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setLearners(data.learners as ILearner[])
                    return;
                }
            })

    }, []);

    return (
        <>
            <div className="row">
                <div className="col s12">
                    <button className="waves-effect waves-light btn-flat"
                        style={{
                            marginRight: "5px"
                        }}
                        onClick={_ => navigate("/learner/import")}
                    ><i className="material-icons right">cloud_upload</i>Import Learners</button>
                    <button 
                        style={{
                            marginRight: "5px"
                        }}
                        className="waves-effect waves-light btn-flat"
                        onClick={_ => navigate("/learner/new")}
                    ><i className="material-icons right">person_add</i>Add Learner</button>

                    {/* exporting the credentials */}
                    <button className="waves-effect waves-light btn-flat"
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
            </div>
            {/* <div className="container">
                <div className="section"> */}
            <div className="row">
                {learners.map((learner, index) => <Learner key={index} {...learner}/>)}
            </div>
                {/* </div>
            </div> */}
        </>
    )
}

export default Learners