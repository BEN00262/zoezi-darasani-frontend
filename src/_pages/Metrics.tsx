import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const options = (isMobile: boolean) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        radiusBackground: {
            color: "#d1d1d1"
        },
        title: {
            display: false
        },
        legend: {
            display: true,
            position: "right",
            fullSize: true,
        },
        pieceLabel: {
            render: 'label',
            arc: true,
            fontColor: '#000',
            position: 'outside'
        },
        datalabels: {
            color: "#000",
            clamp: true,
            font: {
                weight: 'bold'
            },
            formatter: function(value: any, context: any) {
                return Math.round(value) + '%';
            }
        }
    }
})


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
                        boys: ((metrics.boys/total)*100),
                        girls: ((metrics.girls/total)*100)
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
                <Doughnut
                    // @ts-ignore
                    options={options(false)} 
                    data={{
                        labels: ['Boys', 'Girls'],
                        datasets: [
                          {
                            label: 'Boys vs Girls',
                            data: [analytics.boys, analytics.girls],
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(54, 162, 235, 0.2)',
                            ],
                            borderColor: [
                              'rgba(255, 99, 132, 1)',
                              'rgba(54, 162, 235, 1)',
                            ],
                            borderWidth: 2,
                          },
                        ],
                    }} />
            </div>
        </div>
    )
}

export default Metrics