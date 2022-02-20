import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../contexts/GlobalContext";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import DefaultSchoolLogo from "../img/school.png"

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

    useEffect(() => {
        axios.get("/api/school", {
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

                    setSchoolName(data.school);
                    setStats(_stats);
                    return
                }
            })
    }, []);


    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="container">
                <div className="section">

                    <div className="row center">
                        <h5 style={{
                            letterSpacing: "3px"
                        }}>
                            {
                                schoolName.name ? <b>{schoolName.name}</b> : <Skeleton/>
                            }
                        </h5>
                    </div>

                    <div className="row center">
                         <img 
                            id="profile-pic-preview"
                            style={{
                                border: "1px solid #efefef",
                                padding: "2px",
                                height: "200px",
                                width: "200px",
                                objectFit: "contain",
                                borderRadius: "50%"
                            }}
                            src={schoolName.logo ? schoolName.logo : DefaultSchoolLogo}/>
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