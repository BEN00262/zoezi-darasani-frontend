import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useMediaQuery } from 'react-responsive'
import { IProgressData } from '../interfaces/interfaces';


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const options = (isMobile: boolean) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        radiusBackground: {
            color: "#d1d1d1"
        },
            // hoverOffset: 4,
        title: {
            display: false
        },
        legend: {
            display: true,
            position: isMobile ? "bottom" : "right" as const,
            fullSize: true,
            // labels: { textAlign: "start" },
            // title: { text: "Subjects" }
        },
        datalabels: {
            // render: 'percentage',
            // precision: 2,
            color: "#000",
            // anchor: 'end',
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

interface IRevisionSummaryComp {
    analytics: IProgressData[]
}

const RevisionSummaryComp: React.FC<IRevisionSummaryComp> = ({ analytics }) => {
    const isMobilePhone = useMediaQuery({ query: '(max-width: 760px)' });
    const [labels, setLabels] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);

    useEffect(() => {
        setLabels(analytics.map(x => x.subject));
        let total_sum = analytics.reduce((acc, x) => acc + (x.hits || x.progress.length), 0) || 1; // just incase its a 0 to avoid runtime errors
        setData(analytics.map(x => ((x.hits || x.progress.length) / total_sum) * 100));
    }, [analytics]);

    
    return (
        <>
            <div className="col s12" id="student-graph">
                <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                    <div className="card-content">
                        <div className="center">
                            <span className="card-title center"><b><small>REVISION SUMMARY</small></b></span>
                        </div>
                        <div className="row" id="study-graph" style={{
                            height: "400px"
                        }}>
                            
                            <Pie 
                                // plugins={[ChartDataLabels]}
                                data={
                                    {
                                        labels,
                                        datasets: [
                                            {
                                                data,
                                                backgroundColor: ["#ff1744", "#2196f3", "#81d4fa", "#00897b", "#64ffda", "#d4e157", "#ff9800", "#bcaaa4"],
                                                hoverBackgroundColor: ["#ff1744", "#2196f3", "#81d4fa", "#00897b", "#64ffda", "#d4e157", "#ff9800", "#bcaaa4"],
                                            },
                                        ],
                                    }
                                } 
                                // @ts-ignore
                                options={options(isMobilePhone)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RevisionSummaryComp