import axios from 'axios'
import { createRef, useEffect, useState } from 'react'
import Select from 'react-select'
import { useGlobalZoeziTrackedState } from '../../../contexts/GlobalContext'
import { IProgressData, IDataPoint } from '../interfaces/interfaces'
import { zip } from '../utils'
import ChartDisplayComp from "./ChartDisplay"
import ReactToPdf from './ReactToPdf'
import ReportCardComp from "./ReportCard"
import RevisionSummaryComp from "./RevisionSummary"

// fetch the data from this element ---> all the other elements get the data from here and use it
export interface IGradeData {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
    is_special: boolean // if the paper is a special one
}

export interface IPaperType {
    label: string // name of the grade for the visuals
    value: string // id
    _id: string
}

function generate_attempts_time_series(analytics: IProgressData[]) {
    const datapoints = zip(...analytics).map(
        attempt => attempt.reduce(
            (acc, x) => ({
                passed: (x?.attemptTree?.score.passed || 0) + acc.passed,
                total: (x?.attemptTree?.score.total || 0) + acc.total,
            }), { passed: 0, total: 0})
    ).map(y => (y.passed / y.total) * 100 );

    return {
        labels: datapoints.map((_, datapointIndex) => `Attempt ${datapointIndex + 1}`),
        datapoints
    }
}

// const BASE_URL = "http://localhost:3600";

export interface IGradeSelectComp {
    studentId: string
}

const GradeSelectComp: React.FC<IGradeSelectComp> = ({ studentId }) => {
    const { authToken } = useGlobalZoeziTrackedState();
    const [gradeNames, setGradeNames] = useState<IGradeData[]>([]);
    const [paperType, setPaperType] = useState<IPaperType[]>([]);
    const [paperSubType, setPaperSubType] = useState<IPaperType[]>([]);

    // this should be the whole object by the way
    const [selectedGradeName, setSelectedGradeName] = useState<IGradeData>({} as IGradeData);
    const [selectedPaperType, setSelectedPaperType] = useState<IPaperType>({} as IPaperType);
    const [selectedPaperSubType, setSelectedPaperSubType] = useState<string>("");

    const [analytics, setAnalytics] = useState<IProgressData[]>([]);
    const [attemptGrouping, setAttemptGrouping] = useState<IDataPoint[][]>([]);
    const [attemptGroupingPosition, setAttemptGroupingPosition] = useState(-1);
    const [attemptsLabels, setAttemptLabels] = useState<string[]>([]);

    const classId = localStorage.getItem("classId") || "";
    const BASE_URL = `/api/analytics/${studentId}`

    // use to download the page as a pdf ( somehow we need to render this stuff the same way in a computer and the phone )
    // i think thats kind of not needed for now

    const printable_ref = createRef() as React.RefObject<any>;

    const fetch_analytics_data = ( gradeName: string, paperType: string, paperSubType: string ) => {
        // we have the data we can then use it
        axios.get(`${BASE_URL}/${classId}/special-paper-analytics/${gradeName}/${paperType}/${paperSubType}`,{
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => setAnalytics((data.data || [])as IProgressData[]))
    }

    // on load just fetch the grades and place them
    useEffect(() => {
        // on mount
        // fetch the top level grade names

        axios.get(`${BASE_URL}/${classId}/special_paper_stats`, {
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
        // we default the selectedIndex kwanza
        // we check if its a special paper or not and do the stuff 
        if (Object.keys(selectedGradeName).length < 1) {
            return;
        }

        setAttemptGroupingPosition(-1);
        setAnalytics([] as IProgressData[]);

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
                // @ts-ignore
                const adapted_data = data.map(datapoint => ({
                    subject: datapoint.subjectName,
                    hits: datapoint.hits,
                    progress: [
                        {
                            subject: datapoint.subjectName,
                            attemptTree: {
                                score: {
                                    passed: datapoint.ups,
                                    total: datapoint.totalQuestionsAttempted 
                                }
                            }
                        }
                    ]
                }));

                setAnalytics(adapted_data);
                setAttemptGroupingPosition(0); // set to the first data set thats what we need
            })
    }, [selectedGradeName]);


    useEffect(() => {
        if (Object.keys(selectedPaperType).length > 0) {
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

    useEffect(() => {
        const groupings = zip(...analytics);
        setAttemptGrouping(groupings);
        setAttemptLabels(generate_attempts_time_series(analytics).labels);
    }, [analytics]);

    // hide the download button on mobile phones till we solve the pending issues on mobile
    // otherwise ciao
    return (
        <>
            <div className='hide-on-med-and-down'>
                <ReactToPdf 
                    targetRef={printable_ref} 
                    filename="perfomance_report.pdf"
                    x={0}
                    y={0}
                    scale={1}  
                >
                    {({toPdf}:{ toPdf: any }) => (
                        <button         
                            onClick={toPdf}
                            className="waves-effect waves-light btn-small" disabled={!(attemptGroupingPosition > -1 && analytics.length)} style={{
                                position: "fixed",
                                bottom: "20px",
                                right: "20px",
                                zIndex: 2
                            }}>Download Report <i className="material-icons right">cloud_download</i></button>
                    )}
                </ReactToPdf>
            </div>

            {/* the main content */}
            <div className="row" ref={printable_ref}>
                <div className="col s12 m12 l4">
                    <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                    <div className="card-content">
                        <span className="card-title center"><b><small>PERFORMANCE ANALYSIS</small></b></span>
                        <div className="row">

                            <div className="col s12 m12">
                                <label>Select Subscribed Grade</label>
                                <Select
                                    // // @ts-ignore
                                    // styles={(provided: any, state: any) => {
                                    //     return { ...provided, lineHeight: "42px" };
                                    // }}
                                    onChange={item => {
                                        setSelectedPaperType({} as IPaperType);
                                        setSelectedPaperSubType("");


                                        setSelectedGradeName(item || {} as IGradeData);
                                        // setSelectedSpecial(item?.is_special || false)

                                        // we check if the selected paper is special if so clear everything down
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

                            <div className="col s12 m12" hidden={!(selectedPaperSubType && attemptsLabels)}>
                                {/* for special grades only */}
                                <label>Select Attempt</label>
                                <Select
                                    onChange={item => {
                                        setAttemptGroupingPosition(item?.value || 0);
                                    }}
                                    options={attemptsLabels.map((label, index) => {
                                        return {value: index, label }
                                    })} 
                                    placeholder="choose attempt..."/>
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
                        {/* <div className="card z-depth-0" style={{border:"1px solid #dcdee2"}}>
                            <div className="card-content center">
                                POSITION: 100 | AVG. TIME PER QUESTION: 2 mins
                            </div>
                        </div> */}
                        <ChartDisplayComp subjectView={attemptGrouping[attemptGroupingPosition] || []} isChild={false}/>
                </div>

                {/* this are linked to the type of graph on display */}
                {/* these depend on the grouping if selected */}
                {attemptGroupingPosition > -1 && attemptGrouping.length ? 
                   <ReportCardComp subjectView={attemptGrouping[attemptGroupingPosition] || []} is_special={true}/>
                : null}
                { analytics.length ? <RevisionSummaryComp analytics={analytics}/> : null }
            </div>
        </>
    )
}

export default GradeSelectComp