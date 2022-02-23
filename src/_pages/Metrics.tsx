import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import axios from 'axios';
import { Pie, PieChart, ResponsiveContainer, Tooltip as RechartsToolTip } from 'recharts';

let renderLabel = function(entry: any) {
    return <text x={entry.x} y={entry.y} stroke={entry.fill}>
        {entry.name} ( {entry.value}% )
    </text>
}

const Metrics = () => {
    const { authToken } = useContext(GlobalContext);
    const [analytics, setAnalytics] = useState<{ boys: Number, girls: number }>({
        boys: 50,
        girls: 50
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const classRefId = localStorage.getItem("classRefId") || "";

        axios.get(`/api/grade/gender-distribution/${classRefId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    let metrics = data as { boys: number, girls: number };
                    let total = metrics.boys + metrics.girls;

                    setAnalytics({
                        boys: +((metrics.boys/total)*100).toFixed(0),
                        girls: +((metrics.girls/total)*100).toFixed(0)
                    })
                    return;
                }

                throw new Error("Unexpected error");
            })
            .catch(error => {
                setError(error.message);
            })
    }, [])


    return (
        <div className="row">
            {
                error ?
                <div className="row">
                    <div className="col s10 push-s1">
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
            <div className="col s12" style={{
                            height: "400px"
                        }}>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            dataKey="value"
                            
                            data={[
                                { name: "Boys", value: analytics.boys, fill: "rgba(255, 99, 132, 1)" },
                                { name: "Girls", value: analytics.girls, fill: "rgba(54, 162, 235, 1)"},
                            ]}
                            innerRadius={70}
                            outerRadius={140}
                            fill="#82ca9d"
                            label={renderLabel}
                        />
                        <RechartsToolTip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Metrics