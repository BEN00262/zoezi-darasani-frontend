// @ts-ignore
import M from 'materialize-css';

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
import axios from 'axios';
import { GlobalContext } from '../contexts/GlobalContext';
import { ILearner } from '../_pages/Learners';
import { useNavigate } from 'react-router-dom';
import { get_learner_avatar } from '../utils/avatar_chooser';
import { convertMillisecondsToTimeString } from './special_paper_display/grouper/millisecondsToTime';
import { IContent, ILibPaperQuestions, IQuestion } from './normal_paper_display/interface/ILibPaper';
import produce from "immer";
import DiffNormalPaperDisplay from './diff_paper_display/normal_paper_display';
import { PagedPaper } from './special_paper_display/rendering_engine/DataLoaderInterface';
import DiffSpecialPaperDisplay from './diff_paper_display/special_paper_display';

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
    gender: "boy" | "girl" | null
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

// we have stuff :)
interface IAttemptTreePapers {
    isSpecial: boolean
    paper: PagedPaper // this is the paper for the special stuff :)
    trees: ILibPaperQuestions[]
}

const perfomance_comment = (performance: { pass: number, fail: number}[]) => {
    let perfomance_length = performance.length;

    if (perfomance_length <= 1) {
        return "First attempt";
    }

    let _perfomance = performance.reduce((acc, x) => [...acc, x.pass - x.fail],[] as number[]);
    let _progress = (_perfomance.length > 2 ? _perfomance.slice(Math.max(_perfomance.length - 2, 1)) : _perfomance).reduce((acc, y) => y - acc, 0)

    if (_progress === 0) {
        return "No change"
    } else if (_progress < 0) {
        return "Failing"
    } else {
        return "Improving"
    }
}

/*
    interface IAttemptTreePapers {
        questions: IContent[]
        trees: ILibPaperQuestions[]
    }
*/
// returns a library paper state :)
const mergePastPaperStates = (questions: IQuestion[], state: ILibPaperQuestions): ILibPaperQuestions => {
    // use the state to sub and get the questions :)
    const findQuestion = (questionId: string) => questions.find(x => x._id === questionId);

    return produce(state, draft => {
        // this is weird but i sure hope it works :)
        draft.content = draft.content.map(_state => {
            // @ts-ignore
            let _question = findQuestion(_state.content.question);
            console.log(_state.content.question);

            if (!_question) {
                return null;
            }
            // we now have the question ( just push it in :) ) and we are done
            _state.content.question = _question;
            return _state;
        }).filter(x => x) as IContent[]
    });
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
        firstname: "", lastname: "", profilePic: "", gender: null
    });
    const [selectedPaperDone, setSelectedPaperDone] = useState<{
        label: string // the fullnames of the learner
        value: string // the id of the learner
        isSpecial: boolean
    } | null>({ isSpecial: false, label: "", value: "" });

    const [libraryPapers, setLibraryPapers] = useState<IPaperDoneDataPoint[]>([]); // they are just data points with an _id
    const [plottableData, setPlottableData] = useState<{
        pass: number[],
        fail: number[]
    }>({ pass: [], fail: [] });

    const [performanceTrend, setPerformanceTrend] = useState("First attempt");
    const [averageTimePerQuestion, setAverageTimePerQuestion] = useState(0);

    // currently clicked button :)
    const [clickedPastPaperState, setClickedPastPaperState] = useState(0); // we start with the first index i.e., 0
    const [attemptTree, setAttemptTree] = useState<IAttemptTreePapers>({
        isSpecial: false,
        paper: ({} as PagedPaper),
        trees: []
    });

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

        M.Tabs.init(document.querySelector(".sub-tabs"), {})
    }, []);

    useEffect(() => {
        // wipe out the papersDone and the graph
        if (selectedPaperDone && selectedPaperDone.value) {
            axios.get(`/api/analytics/learner/${selectedLearner}/${selectedPaperDone.value}${selectedPaperDone.isSpecial ? "/special": ""}`,
            {
                headers: { Authorization: `Bearer ${authToken}`}
            }).then(({ data }) => {
                if (data) {
                    let _plottable = [...((data.plottable || []) as IPaperDoneDataPoint[])].reverse();
                    // check the length of data :)
                    // get the length of the data

                    // we need to set the graph at this point :)
                    setPlottableData({
                        pass: _plottable.map(x => x.score.passed),
                        fail: _plottable.map(x => x.score.total - x.score.passed)
                    });
                    setAverageTimePerQuestion(data.time_per_question as number);
                    // TODO: fix the wrong message bug :)
                    setPerformanceTrend(perfomance_comment(_plottable.map(x => ({
                        pass: x.score.passed,
                        fail: x.score.total - x.score.passed
                    }))))

                    let _attempt_trees = data.attempt_trees as IAttemptTreePapers;
                    setAttemptTree({
                        ..._attempt_trees,
                        trees: [..._attempt_trees.trees].reverse() // reverse the papers to get them in the right order
                    });
                    setLibraryPapers(_plottable);
                    return;
                } 
            })
        }
    }, [selectedPaperDone]);

    useEffect(() => {
        if (selectedLearner) {

            // reset the core data structures
            setPapersDone([]);
            setSelectedPaperDone(null);
            setPlottableData({fail: [], pass: []});
            setLibraryPapers([]);
            // end of resetting the core data structures

            // fetch the data for the student now
            const classId = localStorage.getItem("classId") || "";

            // if we fail we need to show the error(s)
            axios.get(`/api/analytics/subject/${classId}/${selectedLearner}/${subject}`, {
                headers: { Authorization: `Bearer ${authToken}`}
            }).then(({ data }) => {
                if (data) {
                    setCurrentLearner(data.student as IAnalysisStudent);

                    setPapersDone((data.papersDone as IDonePaper[]).map(y => ({
                        label: `${subject} ( ${y.subject} )`,
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
                                src={currentLearner.profilePic ? currentLearner.profilePic : get_learner_avatar(currentLearner.gender)}
                            />
                            {/* then the class teacher */}
                            <br />
                            <span className="sub-modal-texts" style={{
                                letterSpacing: "1px"
                            }}><b>{currentLearner.firstname} {currentLearner.lastname}</b></span>
                            {
                                papersDone.length ? null :
                                <>
                                    {' '}
                                    <span className='sub-modal-texts' style={{
                                        border: "1px solid red",
                                        padding: "1px 10px",
                                        borderRadius: "20px"
                                    }}>
                                    <b>has not attempted any paper(s)</b>
                                    </span>
                                </>
                            }
                        </div>
                </div> : null }
                {/* the choosing header */}
                <div className="col s12">
                    <ul className="sub-tabs tabs tabs-fixed-width" style={{
                        overflowX: "hidden"
                    }}>
                        <li className="tab col s6"><a href="#analytics" className='active'>Analytics</a></li>
                        <li className={`tab col s6 ${attemptTree.trees.length ? '' : 'disabled'}`}><a href="#lastDonePapers">Last ({libraryPapers.length}) Paper(s)</a></li>
                    </ul>
                </div>

                <div id="analytics">
                    <div className="col s12 m12 l4">
                        <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                        <div className="card-content">
                            {/* <span className="card-title center"><b><small>PERFORMANCE ANALYSIS</small></b></span> */}
                            
                            <div className="row">

                                <div className="col s12 m12">
                                    <label>Learner</label>
                                    <Select
                                        hideSelectedOptions={true}
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
                                        hideSelectedOptions={true}
                                        isDisabled={!!!selectedLearner || !!!papersDone.length}
                                        options={papersDone} 
                                        value={selectedPaperDone}
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
                       {
                           libraryPapers.length ? 
                           <div className="card z-depth-0" style={{
                                border: "1px solid #dcdee2"
                            }}>
                                <div className="card-content sub-modal-texts center">
                                    Remarks: <span style={{
                                            border: "1px solid green",
                                            padding: "1px 2px",
                                            borderRadius: "2px"
                                    }}>
                                        <b>{performanceTrend}</b>
                                    </span>
                                    {
                                        averageTimePerQuestion > 0 ?
                                        <>
                                            {' '}<b>|</b>{' '}
                                            Av. Time Per Question: <span style={{
                                                border: "1px solid green",
                                                padding: "1px 2px",
                                                borderRadius: "2px"
                                            }}><b>{convertMillisecondsToTimeString(averageTimePerQuestion, true)}</b></span>
                                        </> : null
                                    }
                                </div>
                            </div>: null
                       }

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
                </div>

                <div id="lastDonePapers">
                    { attemptTree.trees.length ? 
                    <div className="col s12 m12">
                        <div className="section">
                            <div className="col s12">
                                {/* render the buttons depending on the number of attempts ( create a sort of tabs ) */}
                                {
                                    attemptTree.trees.map((tree, position) => {
                                        return (
                                            <button 
                                                key={`attempt_pill_${position}`}
                                                className={`btn-flat sub-modal-texts ${clickedPastPaperState === position ? "teal lighten-5": ""}`} 
                                                style={{
                                                    border: "1px solid #d3d3d3",
                                                    borderTop: "2px solid #80cbc4",
                                                    borderRadius: "5px 5px 0px 0px",
                                                    marginRight: "1px"
                                                }} 
                                                onClick={_ => {
                                                    setClickedPastPaperState(position);
                                                }}
                                            >
                                                <b>Attempt {position + 1}{' '}
                                                {/* we need to pass the score as the tree here :) */}
                                                <span className='red-text sub-names'>( {tree.score.passed} / {tree.score.total})</span>
                                                </b>
                                            </button>
                                        )
                                    })
                                }

                                <div className="divider" style={{
                                    marginBottom: "5px" // for the spacing :)
                                }}></div>
                            </div>
                            <div className="col s12">
                                {/* check if the paper is a special paper if so render it differently */}
                                {/* show the paper now :) am almost there buana */}
                                {
                                    attemptTree.isSpecial ?
                                    <DiffSpecialPaperDisplay 
                                        gradeName={"Sample Grade"} 
                                        prePaper={attemptTree.paper}
                                        prePrevState={attemptTree.trees[clickedPastPaperState]}
                                    />
                                    :
                                    <DiffNormalPaperDisplay tree={attemptTree.trees[clickedPastPaperState]}/>
                                }
                            </div>
                        </div>
                    </div>
                    : null }
                </div>
            </div>
    )
}

export default SubjectAnalysisComp