import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { useGlobalZoeziTrackedState} from "../contexts/GlobalContext";
import { classIdState, gradeNameState } from "../_pages/GradeDisplayPage";

const PerformanceDistributionCompLazy = React.lazy(() => import("./PerformanceDistribution"))

interface IGeneralMeanAnalytic {
    active: number // Learners
    mean: number // subject mean
    total: number // students
    performance_percentages: {
        [key: string]: number
    }
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
    const { authToken } = useGlobalZoeziTrackedState();

    // we have to set this right :)
    const classId = useRecoilValue(classIdState);
    const gradeName = useRecoilValue(gradeNameState);

    const [generalAnalytic, setGeneralAnalytic] = useState<IGeneralMeanAnalytic>({
        active: 0, mean: 0, total: 0, performance_percentages: {}
    });
    const [meanString, setMeanString] = useState("0.00");

    const {
        isLoading: isFetching, data, isError, error, isIdle, isSuccess
    } = useQuery('in_app_grade_general_mean', () => {
        return axios.get(`/api/deep-analytics/subject-mean/${classId}/${gradeName}/${subject}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data && data.status) {
                    return data.analytics as IGeneralMeanAnalytic;
                }

                throw new Error("Unexpected error!")
            })
    }, { enabled: !!classId && !!gradeName })

    useEffect(() => {
        if (isSuccess && data) {
            setGeneralAnalytic(data);

            if (data.mean) {
                setMeanString(data.mean.toFixed(2));
            }
        }
    }, [isSuccess])

    return (
        <div className="section">
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
                            <p>{(error as Error).message}</p>
                        </div>
                    </div>
                </div>
                : null
            }
            {
                isFetching || isIdle ?
                <div className="row">
                    <div className="col s12">
                        <div className="sub-modal-texts" style={{
                            borderLeft: "2px solid green",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            borderRadius: "3px",
                            lineHeight: "4em",
                            backgroundColor: "rgba(0,255,0, 0.1)",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <i className="material-icons left">info</i>
                            <span><b>Fetching analytics...</b></span>
                        </div>
                    </div>
                </div>
                : null
            }
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
                <React.Suspense fallback={<Skeleton width={400} height={50}/>}>
                    <PerformanceDistributionCompLazy
                        performance_percentages={generalAnalytic.performance_percentages}
                        student_total={generalAnalytic.total}
                    />
                </React.Suspense>
            </div>
            <div className="row center">
                {
                    [ 
                        {
                            label: "Total Learners",
                            point: `${generalAnalytic.total}`
                        },
                        {
                            label: "Active Learners",
                            point: `${generalAnalytic.active}`
                        },
                        {
                            label: "Engagement Percentage",
                            point: `${((generalAnalytic.active/(generalAnalytic.total || 1)) * 100).toFixed(0)}%`
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