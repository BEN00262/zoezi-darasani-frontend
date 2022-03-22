import axios from "axios";
import { SyntheticEvent, useState } from "react"
import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext"
// for toast displays
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { ZoeziQueryClient } from "../utils/queryclient";
import FileUploads from '../img/file_uploads.svg';

const ImportTeachers = () => {
    const navigate = useNavigate();
    const { authToken } = useGlobalZoeziTrackedState();

    const [file, setFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState("");

    const success_toastify = () => toast.success("Successfully imported learner(s)!", {
        position: toast.POSITION.TOP_RIGHT,
        className: "sub-modal-texts",
        onClose: () => navigate(-1) // go back to the grades page after a success :)
    })
    

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        if (file) {
            const form = new FormData();
            form.set('excelFile', file);

            setIsImporting(true);

            axios.post(`/api/teacher/import`, form, {
                headers: { 
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(({ data }) => {
                    if (data) {
                        if (data.status) {
                            ZoeziQueryClient.invalidateQueries('in_app_school_teachers');
                            return success_toastify();
                        }
                    }

                    throw new Error("Failed to import"); // almost impossible
                })
                .catch(error => {
                    setError(error.message)
                })
                .finally(() => setIsImporting(false));
        }
    }

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className='container'>
                <div className="section">
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
                        <div className="col s12 m6 push-m3">
                            <div style={{
                                borderLeft: "2px solid #87CEEB",
                                backgroundColor: "rgba(135,206,235,0.2)",
                                padding: "inherit 10px",
                                fontWeight: "bold"
                            }} className="sub-modal-texts">
                                <ol>
                                    <li>Download the excel template</li>
                                    <li>Fill in the data correctly</li>
                                    <li>Upload the excel file</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="row center">
                        <img src={FileUploads} style={{
                            height: "200px"
                        }} className="img-responsive" alt="file upload image" />
                    </div>


                    <div className="row">
                        <form method='post' onSubmit={handleFormSubmission} className="col s12 m6 push-m3">
                            <div className="col s12 file-field input-field">
                                <div className="btn">
                                    <span>File</span>
                                    <input type="file" onChange={e => {
                                        setFile(e.target.files? e.target.files[0] : null)
                                    }} accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"/>
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
                                    borderRadius: "20px",
                                    marginBottom: "10px"
                                }}><i className="material-icons right">cloud_upload</i>{isImporting ? "Importing..." : "Import Teachers"}</button>
                                <a type="button" href="https://docs.google.com/spreadsheets/d/1Fgs2F2WCskEwzQ9i6HzKzonNiKkgQmjg/edit?usp=sharing&ouid=104149984855413845670&rtpof=true&sd=true" className="waves-effect waves-light btn-flat" style={{
                                    border: "1px solid teal",
                                    borderRadius: "20px",
                                    marginBottom: "10px"
                                }}><i className="material-icons right">cloud_download</i>Download Excel Template</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ImportTeachers