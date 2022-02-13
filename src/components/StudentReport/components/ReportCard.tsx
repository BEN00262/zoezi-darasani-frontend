import { useEffect, useState } from "react"
import { IDataPoint } from "../interfaces/interfaces";
import CertBackground from "../images/certback.png"

function gradingFunction(attained: number, total: number) {

    const n = (attained / total) * 100;
    return n >= 80 ? "A" : n >= 60 ? "B" : n >= 40 ? "C" : "D"
}

function beautifyGradingFunction(attained: number, total: number, display_performance: string) {
    return `${gradingFunction(attained, total)} (${display_performance})`
}

interface IReportCardComp {
    subjectView: IDataPoint[]
    is_special: boolean
}

const ReportCardComp: React.FC<IReportCardComp> = ({ subjectView, is_special }) => {
    const firstname = (localStorage.getItem("_student_name_") || "LEARNER").toUpperCase() + "'S";
    const [gradeAttained, setGradeAttained] = useState<string>("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [marks, setMarks] = useState<string[]>([]);

    useEffect(() => {
        setSubjects(subjectView.map(x => x.subject).filter(x => x));

        let rawGrades = subjectView.map(_subject => {
            let passed = _subject.attemptTree?.score.passed || 0
            let total = _subject.attemptTree?.score.total || 0

            if (passed === 0 && total === 0) { return {} as {passed: number, total: number} }

            return { passed, total }
        }).filter(x => Object.keys(x).length);

        // NOTE: optimize this part later
        let [passed, total] = is_special ? 
            [
                rawGrades.reduce((acc: number, {passed, total}: { passed: number, total: number}) =>
                    acc + (Math.ceil((passed/total) * 100)), 0), // compute the total achieved percentage
                rawGrades.length * 100 // find the totals
            ]
        : 
            rawGrades.reduce((acc, {passed, total}) => [
                acc[0] + passed, acc[1] + total // passed, total
            ], [0,0]);

        setGradeAttained(gradingFunction(passed, total));
        setMarks([...rawGrades, {passed, total}].map(({ passed, total }, index) => {
            return beautifyGradingFunction(
                passed, total, 
                // display_performance
                (is_special && !(index === rawGrades.length)) ? `${(Math.ceil((passed/total) * 100))}%` : `${passed}/${total}`
            )
        }));
    }, [subjectView]);

    return (
        <div className="col s12" id="myreport">
            <div className="card z-depth-0" style={{border:"1px solid #dcdee2",backgroundImage: `url(${CertBackground})`}}>
            <div className="card-content"  id="downloadReport" style={{backgroundImage: "url('/img/certback.png')"}}>

                <div>
                    <div className="center">
                        <h3 className="materialize-red-text sub-headings"><span className="teal-text">ZO</span>EZ<span className="teal-text">I</span></h3>
                        <span><b>{firstname} PERFORMANCE REPORT</b></span><br/>
                        <span>{new Date().toDateString()}</span>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"><path style={{fill:"#d4af37"}} d="M10.557.472c.859-.628 2.026-.628 2.886 0 2.059 1.506 1.616 1.362 4.166 1.354 1.065-.003 2.009.683 2.334 1.696.78 2.427.507 2.052 2.575 3.544.863.623 1.224 1.733.892 2.745-.794 2.417-.798 1.953 0 4.38.333 1.011-.028 2.122-.892 2.745-2.068 1.491-1.794 1.116-2.575 3.544-.325 1.014-1.27 1.7-2.334 1.696-2.551-.008-2.108-.152-4.166 1.354-.859.628-2.026.628-2.886 0-2.059-1.505-1.616-1.363-4.166-1.354-1.065.003-2.009-.683-2.334-1.696-.78-2.43-.511-2.055-2.575-3.544-.863-.623-1.224-1.733-.892-2.745.795-2.417.798-1.953 0-4.38-.333-1.013.028-2.123.891-2.746 2.062-1.489 1.795-1.111 2.575-3.544.325-1.014 1.27-1.7 2.334-1.696 2.545.008 2.096.161 4.167-1.353z"/>
                        <text id="bannerGrade" x="52%" y="55%" dominantBaseline="middle" textAnchor="middle" className="sub-names" style={{fill:"white"}}>
                            {gradeAttained}
                        </text>
                        </svg>
                    </div>

                    <table className="striped responsive-table sub-modal-texts">
                        <thead>
                            <tr>
                                { [...subjects, "Total"].map((_subject, index) => <th key={`subject_${index}`}>{_subject}</th>) }

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                { marks.map((mark, index) => <td key={`mark_${index}`}>{mark}</td>) }
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            </div>
        </div>
    )
}

export default ReportCardComp