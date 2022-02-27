import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {GlobalContext} from "../contexts/GlobalContext";
import { classIdState, gradeNameState } from "../_pages/GradeDisplayPage";

interface IGeneralMeanAnalytic {
    active: number // students
    mean: number // subject mean
    total: number // students
}

interface IStatic {
    name: string
    numeric: string
}

const Static: React.FC<IStatic> = ({ name, numeric }) => {
    return (
        <div className="col s6 m4" style={{
            border: "1px solid #d3d3d3",
            borderRadius: "2px"
        }}>
            <h5 className="sub-names">{name}</h5>
            <p className="sub-modal-texts">{numeric}</p>
        </div>
    )
}

const GeneralMeanComp: React.FC<{ subject: string }> = ({ subject }) => {
    const {
        authToken
    } = useContext(GlobalContext);

    const classId = useRecoilValue(classIdState);
    const gradeName = useRecoilValue(gradeNameState);
    const [generalAnalytic, setGeneralAnalytic] = useState<IGeneralMeanAnalytic>({
        active: 0, mean: 0, total: 0
    });
    const [meanString, setMeanString] = useState("0.00");

    useEffect(() => {
        axios.get(`/api/deep-analytics/subject-mean/${classId}/${gradeName}/${subject}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data && data.status) {
                    let _analytic = data.analytics as IGeneralMeanAnalytic;
                    setGeneralAnalytic(_analytic);
                    setMeanString(_analytic.mean.toFixed(2));
                    return;
                }

                throw new Error("Unexpected error!")
            })
            .catch(error => {
                console.log(error);
            })
    }, []);
    
    return (
        <div className="section">
            <div className="row center sub-names">
                <div className="col s12">
                    <span style={{
                        fontSize: "120px"
                    }} className="teal-text">{meanString.split(".")[0]}</span>
                    <span style={{
                        fontSize: "40px"
                    }} className="teal-text">.{meanString.split(".")[1]}</span>
                    <span style={{
                        marginLeft: "5px"
                    }} className="sub-modal-texts"><b>mean</b></span>
                </div>
            </div>
            <div className="row center">
                {
                    [
                        {
                            label: "Active Students",
                            point: `${generalAnalytic.active}`
                        }, 
                        {
                            label: "Total Students",
                            point: `${generalAnalytic.total}`
                        },
                        {
                            label: "Student Percentage",
                            point: `${((generalAnalytic.active/generalAnalytic.total) * 100).toFixed(0)}%`
                        }
                    ].map(({ label, point }, index) => {
                        return <Static key={`static_${index}`} name={label} numeric={`${point}`}/>
                    })
                }
            </div>
        </div>
    )
}

export default GeneralMeanComp