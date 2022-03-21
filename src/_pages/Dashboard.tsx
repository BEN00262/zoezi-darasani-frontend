import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../contexts/GlobalContext";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import DefaultSchoolLogo from "../img/school.png"
import SchoolMetrics from "../components/SchoolMetrics";
import { useQuery } from "react-query";

interface IStatic {
    name: string
    label: string
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

// get the number of girls vs the number of boys :)
const Dashboard = () => {
    const { authToken } = useContext(GlobalContext);
    const [stats, setStats] = useState<IStatic[]>([
        { name: "Grades", label: "grades", numeric: "0" },
        { name: "Learners", label: "learners", numeric: "0"},
        { name: "Teachers", label: "teachers", numeric: "0"},
    ]);
    const [schoolName, setSchoolName] = useState<{ name: string, logo: string }>({
        name: "", logo:""
    });

    const {
        isError, error, data, isSuccess
    } = useQuery('in_app_school_dashboard', () => {
        return axios.get("/api/school", {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    let keys = Object.keys(data.metrics);
                    let _stats = [...stats]

                    for (let i = 0; i < keys.length;i++) {
                        let _one_stat = _stats.find(x => x.label.toLowerCase() === keys[i]);
                        if (_one_stat) {
                            _one_stat.numeric = `${data.metrics[keys[i]]}`
                        }
                    }

                    return { stats: _stats, school: data.school as { name: string, logo: string} }
                }

                throw new Error("Unexpected error!");
            })
    }, {
        enabled: !!authToken,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });

    useEffect(() => {
        if (isSuccess && data) {
            setSchoolName(data.school);
            setStats(data.stats);
        }
    }, [isSuccess]);

    return (
        <main>
            <div className="container">
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
                    <div className="row center">
                        <h5 style={{
                            letterSpacing: "3px"
                        }}>
                            { schoolName.name ? <b>{schoolName.name}</b> : <Skeleton/> }
                        </h5>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <SchoolMetrics/>
                        </div>
                    </div>

                    <div className="row center">
                        <div>
                            {stats.map((stat, index) => {
                                return <Static key={index} {...stat}/>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard