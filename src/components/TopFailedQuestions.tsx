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

    useEffect(() => {
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
                console.log(error);
            })
    }, [])

    return (
        <>
            <React.Suspense fallback={<LoaderComp/>}>
                <FailedQuestionsPaperDisplayCompSus {...topFailedData}/>
            </React.Suspense>
        </>
    )
}

export default TopFailedQuestionsComp;