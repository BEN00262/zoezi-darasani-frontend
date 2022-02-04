import axios from "axios";
import { SyntheticEvent, useContext, useState } from "react"
import { GlobalContext } from "../contexts/GlobalContext"
// for toast displays
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const ImportStudent = () => {
    const navigate = useNavigate();
    const { authToken } = useContext(GlobalContext);

    const [file, setFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    const success_toastify = () => toast.success("Successfully imported learner(s)!", {
        position: toast.POSITION.TOP_RIGHT,
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })
    

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        if (file) {
            const form = new FormData();
            form.set('excelFile', file);

            // get the current stuff and use it
            const classId = localStorage.getItem("classId") || "";
            const classRefId = localStorage.getItem("classRefId") || "";

            setIsImporting(true);

            axios.post(`/api/learner/import/${classId}/${classRefId}`, form, {
                headers: { 
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(({ data }) => {
                    if (data) {
                        if (data.status) {
                            return success_toastify();
                        }
                    }
                })
                .finally(() => setIsImporting(false));
        }
    }

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className='container'>
                <div className="section">
                    <div className="row">
                        <ToastContainer/>
                        <form method='post' onSubmit={handleFormSubmission} className="col s12 m6 push-m3">
                            <div className="col s12 file-field input-field">
                                <div className="btn">
                                    <span>File</span>
                                    <input type="file" onChange={e => {
                                        setFile(e.target.files? e.target.files[0] : null)
                                    }}/>
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text"/>
                                </div>
                            </div>

                            <div className="col s12 m12 center" style={{
                                marginTop: "10px"
                            }}>
                                <button disabled={isImporting} className="waves-effect waves-light btn-flat" style={{
                                    border: "1px solid teal",
                                    borderRadius: "20px"
                                }}><i className="material-icons right">cloud_upload</i>{isImporting ? "Importing..." : "Import Learners"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ImportStudent