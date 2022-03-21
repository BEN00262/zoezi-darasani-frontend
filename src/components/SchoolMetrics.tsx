import { useContext, useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip as RechartsToolTip, ResponsiveContainer } from "recharts";
import { GlobalContext } from '../contexts/GlobalContext';
import axios from 'axios';
import { useQuery } from 'react-query';


let renderLabel = function(entry: any) {
    return <text x={entry.x} y={entry.y} stroke={entry.fill}>
        {entry.name} ( {entry.value}% )
    </text>
}


const SchoolMetrics = () => {
    const { authToken } = useContext(GlobalContext);
    const [analytics, setAnalytics] = useState<{ boys: Number, girls: number }>({
        boys: 50,
        girls: 50
    });

    const {
        isError, error, data, isSuccess
    } = useQuery('in_app_school_gender_distribution', () => {
        return axios.get("/api/school/gender-analytics", {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    let metrics = data as { boys: number, girls: number };
                    let total = metrics.boys + metrics.girls;

                    return {
                        boys: +((metrics.boys/total)*100).toFixed(0),
                        girls: +((metrics.girls/total)*100).toFixed(0)
                    }
                }

                throw new Error("Unexpected error");
            })
    }, {
        enabled: !!authToken,
        staleTime: 1 * 60 * 1000 // refetch after 1 minute :)
    })

    useEffect(() => {
        if (isSuccess && data) {
            setAnalytics(data);
        }
    }, [isSuccess]);


    return (
        <div className="row">
            {
                isError ?
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
                            <p>{(error as Error).message}</p>
                        </div>
                    </div>
                </div>
                : null
            }
            <div className="col s12" style={{
                height: "300px"
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            dataKey="value"
                            
                            data={[
                                { name: "Boys", value: analytics.boys, fill: "rgba(255, 99, 132, 1)" },
                                { name: "Girls", value: analytics.girls, fill: "rgba(54, 162, 235, 1)"},
                            ]}
                            innerRadius={50}
                            outerRadius={100}
                            fill="#82ca9d"
                            paddingAngle={5}  
                            label={renderLabel}
                        />
                        <RechartsToolTip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SchoolMetrics