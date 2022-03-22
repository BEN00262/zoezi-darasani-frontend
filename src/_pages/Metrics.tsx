import { useEffect, useState } from 'react';
import { useGlobalZoeziTrackedState } from '../contexts/GlobalContext';
import axios from 'axios';
import { Pie, PieChart, ResponsiveContainer, Tooltip as RechartsToolTip } from 'recharts';
import { useRecoilValue } from 'recoil';
import { classRefIdState } from './GradeDisplayPage';
import { useQuery } from 'react-query';
import LoaderComp from '../components/LoaderComp';

const renderLabel = function(entry: any) {
    return <text x={entry.x} y={entry.y} stroke={entry.fill}>
        {entry.name} ( {entry.value}% )
    </text>
}

const Metrics = () => {
    const { authToken } = useGlobalZoeziTrackedState();
    const [analytics, setAnalytics] = useState<{ boys: number, girls: number }>({
        boys: 50,
        girls: 50
    });
    const classRefId = useRecoilValue(classRefIdState);

    const {
        isLoading, isError, error, data, isIdle, isSuccess
    } = useQuery(['in_app_grade_gender_distribution', classRefId], () => {
        return axios.get(`/api/grade/gender-distribution/${classRefId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    const metrics = data as { boys: number, girls: number };
                    const total = metrics.boys + metrics.girls;
                    return { metrics, total }
                }

                throw new Error("Unexpected error");
            })
    }, {
        enabled: !!authToken && !!classRefId,
        staleTime: 1 * 1000 * 60 // refetch after 1 minute
    });

    useEffect(() => {
        if (isSuccess && data) {
            setAnalytics({
                boys: +((data.metrics.boys/data.total)*100).toFixed(0),
                girls: +((data.metrics.girls/data.total)*100).toFixed(0)
            })
        }
    }, [isSuccess])


    if (isLoading || isIdle) {
        return <LoaderComp/>
    }

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