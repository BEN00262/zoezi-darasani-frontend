import axios from "axios";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import { GlobalContext } from "../contexts/GlobalContext";
import { classIdState, gradeNameState } from "../_pages/GradeDisplayPage";
import LoaderComp from "./LoaderComp";
import { IQuestion } from "./special_paper_display/rendering_engine/DataLoaderInterface";

export interface ITopFailedPaperQuestion {
    students: number
    passed: number
    failed: number
    choices: {[optionId: string]: number}
    children_stats: {
        students: number
        passed: number
        failed: number
        choices: {[optionId: string]: number}
        questionId: string
    }[]
    question: IQuestion
}

export interface ITopFailedPaperAnalytics {
    students: number
    stats: ITopFailedPaperQuestion[]
}

const FailedQuestionsPaperDisplayCompSus = React.lazy(() => import("./failed_questions_paper_display"));
export const totalStudentsInSubject = atom({
    key: "totalStudentsInSubjectId",
    default: 0
})

// check if the selection is special or not :)
const TopFailedQuestionsComp: React.FC<{ subject: string }> = ({ subject }) => {
    // interested in fetching the top failed questions per subject :)
    const {
        authToken
    } = useContext(GlobalContext);

    const classId = useRecoilValue(classIdState);
    const gradeName = useRecoilValue(gradeNameState);

    const [topFailedData, setTopFailedData] = useState<ITopFailedPaperAnalytics>({
        stats: [], students: 0
    });
    const setTotalStudentsInSubject = useSetRecoilState(totalStudentsInSubject);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsFetching(true);
        axios.get(`/api/deep-analytics/${classId}/${gradeName}/${subject}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data && data.status) {
                    let _topFailedAnalytics = data.paper as ITopFailedPaperAnalytics;
                    setTopFailedData(_topFailedAnalytics);
                    setTotalStudentsInSubject(_topFailedAnalytics.students);
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
            <React.Suspense fallback={<LoaderComp/>}>
                <FailedQuestionsPaperDisplayCompSus {...topFailedData}/>
            </React.Suspense>
        </div>
    )
}

export default TopFailedQuestionsComp;