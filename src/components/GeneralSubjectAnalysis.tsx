// @ts-ignore
import M from "materialize-css";

import React, { useEffect } from "react";
import LoaderComp from "./LoaderComp";

const TopFailedQuestionsCompSuspense = React.lazy(() => import("./TopFailedQuestions"));
const GeneralMeanCompSuspense = React.lazy(() => import("./GeneralMean"));

const GeneralSubjectAnalysisComp: React.FC<{
    subject: string
}> = ({ subject }) => {

    useEffect(() => {
        M.Tabs.init(document.querySelector(".general-subject-tabs"), {})
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {/* lets start here :) */}
            <div className="col s12">
                <ul className="general-subject-tabs tabs tabs-fixed-width" style={{
                    overflowX: "hidden"
                }}>
                    <li className="tab col s6"><a href="#analytics" className='active'>Analytics</a></li>
                    <li className="tab col s6"><a href="#topFailedQuestions">Top Failed Questions</a></li>
                </ul>
            </div>

            {/* show the data here */}
            <div id="analytics" className="col s12">
                {/* this is the analytics view */}
                <React.Suspense fallback={<LoaderComp/>}>
                    {
                        subject ?
                        <GeneralMeanCompSuspense subject={subject}/>
                        : <LoaderComp/>
                    }
                </React.Suspense>
            </div>

            <div id="topFailedQuestions" className="col s12">
                {/* this is for the top failed questions */}
                <React.Suspense fallback={<LoaderComp/>}>
                    {
                        subject ?
                        <TopFailedQuestionsCompSuspense subject={subject}/>
                        : <LoaderComp/>
                    }
                </React.Suspense>
            </div>
        </div>
    )
}

export default GeneralSubjectAnalysisComp;