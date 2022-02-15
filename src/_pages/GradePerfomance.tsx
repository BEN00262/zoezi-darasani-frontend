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
import { useContext, useEffect, useState } from 'react';
import { IGradeData, IPaperType } from '../components/StudentReport/components/GradeSelect';
import axios from 'axios';
import { GlobalContext } from '../contexts/GlobalContext';
import { IProgressData } from '../components/StudentReport/interfaces/interfaces';

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
            display: false
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

interface IAnalyticSubject {
    subject: string
    performance: number
}



const GradePerfomace: React.FC<{ setClassMeanScore: (mean: number) => void }> = ({ setClassMeanScore }) => {
    const isMobilePhone = false;
    const { authToken } = useContext(GlobalContext);
    const [gradeNames, setGradeNames] = useState<IGradeData[]>([]);
    const [paperType, setPaperType] = useState<IPaperType[]>([]);
    const [paperSubType, setPaperSubType] = useState<IPaperType[]>([]);

    // this should be the whole object by the way
    const [selectedGradeName, setSelectedGradeName] = useState<IGradeData>({} as IGradeData);
    const [selectedPaperType, setSelectedPaperType] = useState<IPaperType>({} as IPaperType);
    const [selectedPaperSubType, setSelectedPaperSubType] = useState<string>("");

    const BASE_URL = `/api/analytics` // we dont care for the second grade

    const [analytics, setAnalytics] = useState<IAnalyticSubject[]>([]);

    const fetch_analytics_data = ( gradeName: string, paperType: string, paperSubType: string ) => {
        // we have the data we can then use it
        // we coded this part right :)
        const classId = localStorage.getItem("classId") || "";

        axios.get(`${BASE_URL}/${classId}/special-paper-analytics/${gradeName}/${paperType}/${paperSubType}`,{
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => setAnalytics((data || []) as IAnalyticSubject[]))
    }

    // on load just fetch the grades and place them
    useEffect(() => {
        // on mount
        // fetch the top level grade names
        const classId = localStorage.getItem("classId") || "";

        axios.get(`${BASE_URL}/grade/${classId}/special_paper_stats`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                setGradeNames(
                    data.map(({ grade, is_special, _id }: { grade: string, is_special: boolean, _id: string }) => ({
                        label: `${grade}${is_special ? " | special" : ""}`, value: `${grade}${is_special ? "_special" : ""}`, is_special, _id
                    }))
                )
            });

    }, []);

    useEffect(() => {
        if (analytics.length) {
            setClassMeanScore(
                analytics.reduce((acc, x) => acc + x.performance,0) / analytics.length
            )
        }
    }, [analytics]);

    useEffect(() => {
        const classId = localStorage.getItem("classId") || "";
        // we default the selectedIndex kwanza
        // we check if its a special paper or not and do the stuff 
        if (Object.keys(selectedGradeName).length < 1) {
            return;
        }

        // setAttemptGroupingPosition(-1);
        setAnalytics([] as IAnalyticSubject[]);

        if (selectedGradeName.is_special) {
            // fetch subsequent data ( if not just fetch the othe data )
            // place the subTypes here ( we )
            axios.get(`${BASE_URL}/${classId}/special_paper_stats/${selectedGradeName._id || selectedGradeName.value}`, {
                headers: { Authorization: `Bearer ${authToken}`}
            })
                .then(({ data }) => {
                    setPaperType(
                        data.map(({ subType, _id }: { subType: string, _id: string }) => ({
                            value: subType, _id, label: `${subType}s`
                        }))
                    )
                });
            return;
        }

        // fetch the not special data
        axios.get(`${BASE_URL}/${classId}/report_analytics/${selectedGradeName.value}`, {
                headers: { Authorization: `Bearer ${authToken}`}
            })
                .then(({ data }) => {
                    if (data) {
                        setAnalytics((data || []) as IAnalyticSubject[]);
                        return;
                    }
                })
    }, [selectedGradeName]);

    useEffect(() => {
        if (Object.keys(selectedPaperType).length > 0) {
            const classId = localStorage.getItem("classId") || "";
            
            setPaperSubType([] as IPaperType[]);
            axios.get(`${BASE_URL}/${classId}/special_paper_stats/${selectedGradeName._id || selectedGradeName.value}/${selectedPaperType._id}`, {
                headers: { Authorization: `Bearer ${authToken}`}
            })
                .then(({ data }) => {
                    setPaperSubType(
                        data.map(({ subsubType, _id }: { subsubType: string, _id: string }) => ({
                            value: subsubType, label: subsubType, _id
                        }))
                    )
            });
        }
    }, [selectedPaperType]);

    useEffect(() => {
        if (selectedPaperSubType) {
            fetch_analytics_data(selectedGradeName.value, selectedPaperType.value, selectedPaperSubType);
        }
    }, [selectedPaperSubType]);

    return (
        <div>
            <div className="row">
                <div className="col s12 m12 l4">
                    <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                    <div className="card-content">
                        <span className="card-title center"><b><small>PERFORMANCE ANALYSIS</small></b></span>
                        <div className="row">

                            <div className="col s12 m12">
                                <label>Select Subscribed Grade</label>
                                <Select
                                    onChange={item => {
                                        setSelectedPaperType({} as IPaperType);
                                        setSelectedPaperSubType("");

                                        setSelectedGradeName(item || {} as IGradeData);
                                    }}
                                    options={gradeNames} 
                                    placeholder="choose grade..."/>
                                
                            </div>

                            <div className="col s12 m12" hidden={!(selectedGradeName && selectedGradeName.is_special)}>
                                {/* for special grades only */}
                                <label>Select Type</label>
                                <Select
                                    options={paperType} 
                                    onChange={item => {
                                        setSelectedPaperType(item || {} as IPaperType)
                                    }}
                                    placeholder="choose type..."/>
                            </div>

                            <div className="col s12 m12" hidden={!(selectedPaperType && selectedPaperType.value)}>
                                <label>Select Paper</label>
                                <Select
                                    onChange={item => {
                                        setSelectedPaperSubType(item?.value || "")
                                    }}
                                    options={paperSubType} 
                                    placeholder="choose paper..."/>
                            </div>

                        </div>

                        {/* // <!-- create a report generator button --> */}
                        <div className="row" id="performanceReportButton" hidden>

                            <div className="col s12 m12">
                                <button onClick={() => {
                                    // "activatePerfomanceReport();"
                                }} data-position="bottom" data-tooltip="Scroll down to view or download the report" className="btn-small sub-modal-texts tooltipped white black-text waves-effect waves-black z-depth-1" style={{width:"100%", fontWeight:"bold"}}>PERFORMANCE REPORT<i className="material-icons right">assessment</i></button>
                            </div>

                        </div>

                    </div>
                    </div>
                </div>

                <div className="col s12 m12 l8">
                    <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                        <div className="card-content">
                            <div className="row" id="insertChart">

                                <Bar
                                    // @ts-ignore
                                    options={options('Subject Mean Score', isMobilePhone)}
                                    style={{ ...(isMobilePhone ? { height:  "400px" } : { height: "300px" })}}
                                    data={{
                                        labels: analytics.map(x => x.subject),
                                        datasets: [
                                            {
                                                label: 'Subject Mean Score',
                                                data: analytics.map(x => x.performance),
                                                backgroundColor: ["#ff1744", "#2196f3", "#81d4fa", "#00897b", "#64ffda", "#d4e157", "#ff9800", "#bcaaa4"],
                                                hoverBackgroundColor: ["#ff1744", "#2196f3", "#81d4fa", "#00897b", "#64ffda", "#d4e157", "#ff9800", "#bcaaa4"],
                                            }
                                        ],
                                    }}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GradePerfomace