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
import { ILearner } from '../_pages/Learners';
import { useNavigate } from 'react-router-dom';

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

interface IDonePaper {
    subject: string // this is the name of the paper ( am too tired to change it anyways )
    latestDone: Date // the last time thi paper was done ( in attempts :) )
    isSpecial: boolean // check whether the paper is special or not ( enables us to choose the best url to use )
    paperID: string // used for easy fetching of the papers afterwards :) ( for the old type of papers we should do something different ---> for now though ---> meeh )
}

interface IAnalysisStudent {
    firstname: string
    lastname: string
    profilePic: string
}

export interface ISubjectAnalysisComp {
    subject: string
}

interface IPaperDoneDataPoint {
    _id: string
    subject: string
    isSpecial: boolean
    paperID: string
    grade: string
    score: {
        passed: number
        total: number
    }
}

const SubjectAnalysisComp: React.FC<ISubjectAnalysisComp> = ({ subject }) => {
    const { authToken } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [learners, setLearners] = useState<{
        label: string // the fullnames of the learner
        value: string // the id of the learner
    }[]>([]);

    const [papersDone, setPapersDone] = useState<{
        label: string // the fullnames of the learner
        value: string // the id of the learner
        isSpecial: boolean
    }[]>([]);
    const [selectedLearner, setSelectedLearner] = useState(""); // we get the selected learner and display the data :)
    const [currentLearner, setCurrentLearner] = useState<IAnalysisStudent>({
        firstname: "", lastname: "", profilePic: ""
    });
    const [selectedPaperDone, setSelectedPaperDone] = useState<{
        label: string // the fullnames of the learner
        value: string // the id of the learner
        isSpecial: boolean
    }>({ isSpecial: false, label: "", value: "" });

    const [libraryPapers, setLibraryPapers] = useState<IPaperDoneDataPoint[]>([]); // they are just data points with an _id
    const [plottableData, setPlottableData] = useState<{
        pass: number[],
        fail: number[]
    }>({ pass: [], fail: [] });

    const isMobilePhone = false;
    // get the listing of the students in the entire class ( whether they did anything or not )
    // show them in a dropdown and then enable filtering on the papers they did 
    // the papers will be filtered from the last one to the current one ( also take timesteps of the papers )
    

    useEffect(() => {
        const classRefId = localStorage.getItem("classRefId") || "";

        axios.get(`/api/grade/learners/${classRefId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data) {
                setLearners((data.learners as ILearner[]).map(x => ({ label: `${x.firstname} ${x.lastname}`, value: x._id})));
                return;
            }
        })

    }, []);

    useEffect(() => {
        if (selectedPaperDone.value) {
            axios.get(`/api/analytics/learner/${selectedLearner}/${selectedPaperDone.value}${selectedPaperDone.isSpecial ? "/special": ""}`,
            {
                headers: { Authorization: `Bearer ${authToken}`}
            }).then(({ data }) => {
                if (data) {
                    let _plottable = data.plottable as IPaperDoneDataPoint[];
                    // we need to set the graph at this point :)
                    setPlottableData({
                        pass: _plottable.map(x => x.score.passed),
                        fail: _plottable.map(x => x.score.total - x.score.passed)
                    });

                    setLibraryPapers(_plottable);
                    return;
                } 
            })
        }
    }, [selectedPaperDone]);

    useEffect(() => {
        if (selectedLearner) {
            // fetch the data for the student now
            const classId = localStorage.getItem("classId") || "";

            axios.get(`/api/analytics/subject/${classId}/${selectedLearner}/${subject}`, {
                headers: { Authorization: `Bearer ${authToken}`}
            }).then(({ data }) => {
                if (data) {
                    setCurrentLearner(data.student as IAnalysisStudent);

                    setPapersDone((data.papersDone as IDonePaper[]).map(y => ({
                        label: y.subject,
                        value: y.paperID,
                        isSpecial: y.isSpecial
                    })))

                    return;
                }
            })

        }
    }, [selectedLearner]);
    
    return (
        <div className="row">
                {currentLearner.firstname ? 
                <div className="col s12 center">
                        <div style={{
                            margin: "auto"
                        }}>
                            <img
                                style={{
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "contain",
                                    border: "1px solid #d3d3d3",
                                    borderRadius: "50%"
                                }} 
                                // the currentLearner profile pic will be a base64 encoded image ( which will make the process easier )
                                src={currentLearner.profilePic ? currentLearner.profilePic : "https://cdn2.iconfinder.com/data/icons/child-people-face-avatar-3/500/child_152-512.png"}
                            />
                            {/* then the class teacher */}
                            <br />
                            <span className="sub-modal-texts" style={{
                                letterSpacing: "1px"
                            }}><b>{currentLearner.firstname} {currentLearner.lastname}</b></span>
                        </div>
                </div> : null }
                <div className="col s12 m12 l4">
                    <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                    <div className="card-content">
                        {/* <span className="card-title center"><b><small>PERFORMANCE ANALYSIS</small></b></span> */}
                        <div className="row">

                            <div className="col s12 m12">
                                <label>Learner</label>
                                <Select
                                    onChange={item => {
                                        setSelectedLearner(item?.value || "");
                                    }}
                                    options={learners} 
                                    placeholder="select learner..."/>
                                
                            </div>

                            {/* fetch all the papers that the student has done ( both special and the normal ones ) */}
                            <div className="col s12 m12">
                                <label>Paper</label>
                                <Select
                                    options={papersDone} 
                                    onChange={item => {
                                        // se the paper
                                        setSelectedPaperDone((item || {}) as { 
                                            label: string, value: string, isSpecial: boolean 
                                        });
                                    }}
                                    placeholder="select paper..."/>
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
                                    options={options('Performance Analysis', isMobilePhone)}
                                    style={{ ...(isMobilePhone ? { height:  "400px" } : { height: "300px" })}}
                                    data={{
                                        labels: plottableData.pass.map((_, index) => `Attempt ${index + 1}`),
                                        datasets: [
                                            {
                                                label: 'Pass',
                                                data: plottableData.pass,
                                                backgroundColor: '#00c853',
                                            },
                                            {
                                                label: 'Fail',
                                                data: plottableData.fail,
                                                backgroundColor: '#f44336',
                                            }
                                        ],
                                    }}
                                />

                            </div>
                        </div>
                    </div>
                </div>

                { libraryPapers.length ? 
                <div className="col s12 m12">
                    <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                    <h5 className="center sub-sub-headings">Last ({libraryPapers.length}) paper(s)</h5>
                    <div className="divider"></div>

                    <div className="section">
                    {
                            libraryPapers.map((libpaper, index) => {
                                // check if whether the paper is special or not
                                return (
                                    <div className="col s6 m2 l2" key={index}>
                                        <div className="hoverable" 
                                            onClick={_ => navigate(
                                                libpaper.isSpecial ? `/library-paper/special/${selectedLearner}/${libpaper.grade}/${libpaper.paperID}/${libpaper._id}`: `/library-paper/${selectedLearner}/${libpaper._id}`
                                            )}

                                            style={{
                                                    backgroundColor: "#fffde7",
                                                    marginBottom: "5px",
                                                    cursor: "pointer",
                                                    border: "1px solid #d3d3d3",
                                                    borderRadius: "2px",
                                                    padding: "4px"
                                                }}
                                            >

                                            <div className="center">

                                                <span className="sub-names truncate"><b>{libpaper.subject}</b></span>
                                                <br/>
                                                <span className="sub-modal-texts teal-text truncate" style={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #d3d3d3",
                                                    padding: "4px",
                                                    borderRadius: "2px"
                                                }}>
                                                    <b>{libpaper.subject.split(" ")[0].toLocaleLowerCase().includes("kiwahili") ? "ALAMA": "SCORE"}
                                                        ({libpaper.score.passed }/{libpaper.score.total})
                                                    </b>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                : null }
            </div>
    )
}

export default SubjectAnalysisComp