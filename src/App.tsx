import { 
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Footer from "./components/Footer"
import Navigation from "./components/Navigation"
import NormalPaperDisplay from "./components/normal_paper_display";
import SpecialPaperLibraryPaper from "./components/special_paper_display";
import GlobalContextComp from "./contexts/GlobalContext"
import ProtectedRoute, { ForwardProtectedRoute } from "./protected"
import ErrorPage from "./_pages/404";
import ApplicationSuccessPage from "./_pages/ApplicationSuccessPage";
import RegistrationPage from "./_pages/child/pages/RegistrationPage";
import Dashboard from "./_pages/Dashboard"
import GradeDisplayPage from "./_pages/GradeDisplayPage"
import GradesPage from "./_pages/Grades"
import HomePage from "./_pages/HomePage"
import ImportStudent from "./_pages/ImportStudents"
import LoginPage from "./_pages/LoginPage"
import MarketPage from "./_pages/market/market"
import MarketGrade from "./_pages/market/market-grade"
import CheckoutComp from "./_pages/market/steps/CheckoutComp";
import ChooseGradesComp from "./_pages/market/steps/ChooseGradesComp";
import NewGrade from "./_pages/NewGrade"
import NewLearner from "./_pages/NewLearner"
import NewSchool from "./_pages/NewSchool"
import NewSubject from "./_pages/NewSubject"
import NewTeacher from "./_pages/NewTeacher"
import PasswordRecovery from "./_pages/PasswordRecovery";
import StudentAnalysis from "./_pages/StudentAnalysis"
import SubjectAnalysis from "./_pages/SubjectAnalysis"
import TeacherDisplayPage from "./_pages/TeacherDisplayPage"
import Teachers from "./_pages/Teachers"

const App = () => {
  return (
    <Router>
      <GlobalContextComp>
        <Navigation/>
        {/* <main> */}
          {/* start of the routes */}
          <Routes>
            <Route element={<ForwardProtectedRoute/>}>
              <Route path="/" element={<HomePage/>}/>
            </Route>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/new-school" element={<NewSchool/>}/>
            <Route path="/application/success" element={<ApplicationSuccessPage/>}/>

            <Route path="/recovery" element={<PasswordRecovery/>}/>
            
            <Route element={<ProtectedRoute/>}>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/teacher" element={<Teachers/>}/>
              <Route path="/teacher/:id" element={<TeacherDisplayPage/>}/>
              <Route path="/teacher/new" element={<NewTeacher/>}/>
              <Route path="/teacher/edit/:id" element={<NewTeacher/>}/>

              {/* library display */}
              <Route path="/library-paper/:studentId/:paperId" element={<NormalPaperDisplay/>}/>
              <Route 
                path="/library-paper/special/:studentId/:gradeName/:paperID/:savedStateID" 
                element={<SpecialPaperLibraryPaper/>}/>

              {/* market links */}
              <Route path="/market" element={<MarketPage/>}/>
              <Route path="/market/:gradeName" element={<MarketGrade/>}/>
              <Route path="/market/select/:gradeId" element={<ChooseGradesComp/>}/>
              <Route path="/market/checkout/:subscriptionId" element={<CheckoutComp/>}/>

              <Route path="/grades" element={<GradesPage/>}/>
              <Route path="/grades/:id" element={<GradeDisplayPage/>}/>
              <Route path="/grades/new" element={<NewGrade/>}/>

              {/* learner routes */}
              <Route path="/learner/:id" element={<StudentAnalysis/>}/>
              <Route path="/learner/new" element={<RegistrationPage/>}/>
              <Route path="/learner/edit/:studentId" element={<RegistrationPage/>}/>
              <Route path="/learner/import" element={<ImportStudent/>}/>

              {/*subject  */}
              <Route path="/subject/new" element={<NewSubject/>}/> 
              <Route path="/subject/:id" element={<SubjectAnalysis/>}/>
            </Route>
            <Route path="*" element={<ErrorPage/>}/>
          </Routes>
          {/* end of the routes */}
        {/* </main> */}
        <Footer/>
      </GlobalContextComp>
    </Router>
  )
}

export default App