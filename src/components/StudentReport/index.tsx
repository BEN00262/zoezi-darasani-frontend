import GradeSelectComp from "./components/GradeSelect"

// This is the default import for the module
interface IStudentReport {
    studentId: string
}

const StudentReport: React.FC<IStudentReport> = ({ studentId }) => <GradeSelectComp studentId={studentId}/>

export default StudentReport