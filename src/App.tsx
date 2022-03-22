import React from "react";
import { 
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import {
  QueryClientProvider
} from 'react-query';
import { ZoeziQueryClient } from './utils/queryclient';
import "./App.css";
import Footer from "./components/Footer"
import Navigation from "./components/Navigation"
import NormalPaperDisplay from "./components/normal_paper_display";
import PointedQuestionPaper from "./components/pointed_question_paper";
import SpecialPaperLibraryPaper from "./components/special_paper_display";
import {GlobalContextComp} from "./contexts/GlobalContext"
import ProtectedRoute, { AdminScopedRoute, ForwardProtectedRoute } from "./protected"
import ErrorPage from "./_pages/404";
import AccountSettings from "./_pages/AccountSettings";
import RegistrationPage from "./_pages/child/pages/RegistrationPage";
import Dashboard from "./_pages/Dashboard"
import GradeDisplayPage from "./_pages/GradeDisplayPage"
import GradesPage from "./_pages/Grades"
import HomePage from "./_pages/HomePage"
import ImportStudent from "./_pages/ImportStudents"
import ImportTeachers from "./_pages/ImportTeachers";
import LoaderPage from "./_pages/loader";
import LoginPage from "./_pages/LoginPage"
import MarketPage from "./_pages/market/market"
import MarketGrade from "./_pages/market/market-grade"
import CheckoutComp from "./_pages/market/steps/CheckoutComp";
import ChooseGradesComp from "./_pages/market/steps/ChooseGradesComp";
import NewGrade from "./_pages/NewGrade"
import NewSchool from "./_pages/NewSchool"
import NewSubject from "./_pages/NewSubject"
import NewTeacher from "./_pages/NewTeacher"
import PasswordRecovery from "./_pages/PasswordRecovery";
import PricingPage from "./_pages/PricingPage";
import StudentAnalysis from "./_pages/StudentAnalysis"
import SubjectAnalysis from "./_pages/SubjectAnalysis"
import SubscriptionsPage from "./_pages/SubscriptionsPage";
import SubscriptionViewPage from "./_pages/SubscriptionView";
import TeacherDisplayPage from "./_pages/TeacherDisplayPage"
import Teachers from "./_pages/Teachers"

const App = () => {
  return (
    <Router>
      <React.Suspense fallback={<LoaderPage/>}>
      <RecoilRoot>
        <RecoilNexus/>
        <GlobalContextComp>
          <QueryClientProvider client={ZoeziQueryClient}>
              <Navigation/>
                <Routes>
                  <Route element={<ForwardProtectedRoute/>}>
                    <Route path="/" element={<HomePage/>}/>
                  </Route>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/new-school" element={<NewSchool/>}/>
                  <Route path="/pricing" element={<PricingPage/>}/>

                  <Route path="/recovery" element={<PasswordRecovery/>}/>
                  
                  <Route element={<ProtectedRoute/>}>
                    {/* this is not scoped as an admin only page :) */}
                    <Route path="/teacher/:id" element={<TeacherDisplayPage/>}/>
                    <Route path="/teacher/edit/:id" element={<NewTeacher/>}/>
                    <Route path="/view-paper/:paperID/:selectedQuestion" element={<PointedQuestionPaper/>}/>

                    <Route element={<AdminScopedRoute/>}>
                      <Route path="/dashboard" element={<Dashboard/>}/>
                      <Route path="/teacher" element={<Teachers/>}/>
                      <Route path="/teacher/new" element={<NewTeacher/>}/>
                      <Route path="/teacher/import" element={<ImportTeachers/>}/>

                      {/* market links */}
                      <Route path="/shop" element={<MarketPage/>}/>
                      <Route path="/shop/:gradeName" element={<MarketGrade/>}/>
                      <Route path="/shop/select/:gradeId" element={<ChooseGradesComp/>}/>
                      <Route path="/shop/checkout/:gradeId/:subscriptionId" element={<CheckoutComp/>}/>

                      {/* a listing of all the subscriptions */}
                      <Route path="/subscriptions" element={<SubscriptionsPage/>}/>
                      <Route path="/subscriptions/:transactionId" element={<SubscriptionViewPage/>}/>

                      {/* settings */}
                      <Route path="/account" element={<AccountSettings/>}/>

                      <Route path="/grades" element={<GradesPage/>}/>
                      <Route path="/grades/new" element={<NewGrade/>}/>

                      {/*subject  */}
                      <Route path="/subject/new/:gradeName" element={<NewSubject/>}/> 
                    </Route>

                    {/* library display */}
                    <Route path="/library-paper/:studentId/:paperId" element={<NormalPaperDisplay/>}/>
                    <Route 
                      path="/library-paper/special/:studentId/:gradeName/:paperID/:savedStateID" 
                      element={<SpecialPaperLibraryPaper/>}/>

                    <Route path="/grades/:id" element={<GradeDisplayPage/>}/>

                    {/* learner routes */}
                    <Route path="/learner/:id" element={<StudentAnalysis/>}/>
                    <Route path="/learner/new" element={<RegistrationPage/>}/>
                    <Route path="/learner/edit/:studentId" element={<RegistrationPage/>}/>
                    <Route path="/learner/import" element={<ImportStudent/>}/>

                    {/*subject  */}
                    <Route path="/subject/:id" element={<SubjectAnalysis/>}/>
                  </Route>
                  <Route path="*" element={<ErrorPage code={404} message={"Page Not Found"}/>}/>
                </Routes>
              <Footer/>
          </QueryClientProvider>
        </GlobalContextComp>
      </RecoilRoot>
      </React.Suspense>
    </Router>
  )
}

export default App