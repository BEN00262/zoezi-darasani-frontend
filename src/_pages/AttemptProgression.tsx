import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Select from 'react-select';
import { Bar } from "react-chartjs-2"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
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
            display: false,
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

const AttemptProgressComp = () => {
    const isMobilePhone = false;

    const data = {
        labels: ["English", "Kiswahili", "Mathematics", "Science"],
        datasets: [
            {
                label: 'Pass',
                data: [2, 7, 7,5],
                backgroundColor: '#00c853',
            },
            {
                label: 'Fail',
                data: [5, 8, 1, 7],
                backgroundColor: '#e53935',
            }
        ],
    };

    return (
        <div className="row" id="insertChart">

            {/* and place the ability to drill down to the specific stuff */}
            {/* copy pasting here */}

            <div className="col s12 m12 l4">
                <div className="card z-depth-0">
                    <div className="card-content">
                        {/* <span className="card-title center"><b><small>PERFORMANCE ANALYSIS</small></b></span> */}
                        <div className="row">

                            <div className="col s12 m12">
                                <label>Select Type</label>
                                <Select
                                    options={[]} 
                                    onChange={item => {
                                        // setSelectedPaperType(item || {} as IPaperType)
                                    }}
                                    placeholder="choose type..."/>
                            </div>

                            <div className="col s12 m12">
                                <label>Select Paper</label>
                                <Select
                                    onChange={item => {
                                        // setSelectedPaperSubType(item?.value || "")
                                    }}
                                    options={[]} 
                                    placeholder="choose paper..."/>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div className="col s12 m12 l8">
                <Bar
                    // @ts-ignore
                    options={options('Progess Analysis', isMobilePhone)}
                    // style={{ ...(isMobilePhone ? { height:  "400px" } : { height: "300px" })}}
                    data={data}
                />
            </div>
        </div>
    )
}

export default AttemptProgressComp