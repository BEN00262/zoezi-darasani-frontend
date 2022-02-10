import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from "react-chartjs-2"
import { useMediaQuery } from 'react-responsive'
import { IDataPoint } from '../interfaces/interfaces';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export const options = (titleText: string, isMobile: boolean) =>({
    indexAxis: isMobile ? "y" : "x" as const,
    responsive: true,
    maintainAspectRatio: false,
    redraw: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: titleText,
        },
        barValueSpacing: 40,
        tooltips: {
            displayColors: true,
            callbacks: { mode: "x" }
        },
        datalabels: {
            display: (context: any) => false,
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: true,
                    drawBorder: false
                }
            }],
            yAxes: [{
                gridLines: {
                    display: false,
                    drawBorder: true
                }
            }]
        },
    
    },
});

export interface IChartDisplayComp {
    isChild: boolean
    subjectView: IDataPoint[]
}

const ChartDisplayComp:React.FC<IChartDisplayComp> = ({ isChild, subjectView }) => {
    // check if we are in a phone
    const isMobilePhone = false; // useMediaQuery({ query: '(max-width: 760px)' })

    const labels = subjectView.map(x => x.subject).filter(x => x);
    const datapoints = subjectView.reduce((acc: { passed: number[], failed: number[] }, x) => ({
        passed: [ ...acc.passed, (x.attemptTree?.score?.passed || 0) ],
        failed: [ ...acc.failed, ((x.attemptTree?.score?.total || 0) - (x.attemptTree?.score?.passed || 0))]
    }), { passed: [], failed: [] });

    const [passed, failed] = datapoints.passed.reduce((acc: number[][], x, position) => 
        (x === 0 && datapoints.failed[position] === 0) ? acc :
        // [[passed], [failed]]
        [ [...acc[0], x], [...acc[1], datapoints.failed[position]] ]
    , [[],[]]);

    const data = {
        labels,
        datasets: [
            {
                label: 'Pass',
                data: passed,
                backgroundColor: '#00c853',
            },
            {
                label: 'Fail',
                data: failed,
                backgroundColor: '#e53935',
            },
        ],
    };


    // this can fetch data on its own or be given data depending on whether it is a child or not
    // a child fetches its own data
    
    return (
        <div>
            <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                <div className="card-content">
                    <div className="row" id="insertChart">

                        {/* <div className="right">
                            <button id="chartdownload" disabled onClick={() => {
                                // "DownloadGraphToLocal()"
                            }} className="btn-small sub-modal-texts white black-text waves-effect waves-black z-depth-1"><b>DOWNLOAD</b><i className="material-icons right">file_download</i></button>
                        </div> */}
                        
                        {/* this is the only unique part to the bar chart i think */}

                        <Bar
                            // @ts-ignore
                            options={options('Performance Analysis', isMobilePhone)}
                            style={{ ...(isMobilePhone ? { height:  "400px" } : { height: "300px" })}}
                            data={data}
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartDisplayComp