import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext";
import { classIdState, gradeNameState } from "../_pages/GradeDisplayPage";
import LoaderComp from "./LoaderComp";
import GlobalErrorBoundaryComp from "./special_paper_display/components/GlobalErrorBoundaryComp";
import { IQuestion } from "./special_paper_display/rendering_engine/DataLoaderInterface";

export interface ITopFailedChildrenStats {
    students: number
    passed: number
    failed: number
    choices: {[optionId: string]: number}
    questionId: string
}

export interface ITopFailedPaperQuestion {
    students: number
    passed: number
    failed: number
    paperName: string | null
    paperID: string | null
    questionPosition: number | null
    choices: {[optionId: string]: number}
    children_stats: ITopFailedChildrenStats[]
    question: IQuestion
}

export interface ITopFailedPaperAnalytics {
    students: number
    students_who_did: number
    stats: ITopFailedPaperQuestion[]
}

const FailedQuestionsPaperDisplayCompSus = React.lazy(() => import("./failed_questions_paper_display"));
export const totalStudentsInSubject = atom({
    key: "totalStudentsInSubjectId",
    default: 0
})

export const studentsWhoPartcipatedState = atom({
    key: "studentsWhoPartcipatedStateId",
    default: 0
})
// check if the selection is special or not :)
const TopFailedQuestionsComp: React.FC<{ subject: string }> = ({ subject }) => {
    // interested in fetching the top failed questions per subject :)
    const {
        authToken
    } = useGlobalZoeziTrackedState();

    const classId = useRecoilValue(classIdState);
    const gradeName = useRecoilValue(gradeNameState);

    const [topFailedData, setTopFailedData] = useState<ITopFailedPaperAnalytics>({
        stats: [], students: 0, students_who_did: 0
    });
    const setTotalStudentsInSubject = useSetRecoilState(totalStudentsInSubject);
    const setStudentsWhoParticipated = useSetRecoilState(studentsWhoPartcipatedState);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsFetching(true);
        axios.get(`/api/deep-analytics/${classId}/${gradeName}/${subject}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data && data.status) {
                    const _topFailedAnalytics = data.paper as ITopFailedPaperAnalytics;
                    setTopFailedData(_topFailedAnalytics);
                    setTotalStudentsInSubject(_topFailedAnalytics.students);
                    setStudentsWhoParticipated(_topFailedAnalytics.students_who_did);
                    return;
                }

                throw new Error("Unexpected error!");
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setIsFetching(false);
            })
    }, []);

    if (isFetching) {
        return <LoaderComp/>
    }

    return (
        <div className="section">
            {
                error ?
                <div className="row">
                    <div className="col s12">
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
            <GlobalErrorBoundaryComp>
                <React.Suspense fallback={<LoaderComp/>}>
                    <FailedQuestionsPaperDisplayCompSus {...topFailedData}/>
                </React.Suspense>
            </GlobalErrorBoundaryComp>
        </div>
    )
}

export default TopFailedQuestionsComp;