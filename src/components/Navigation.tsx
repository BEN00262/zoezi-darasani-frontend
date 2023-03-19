import {Link} from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil";
import { useGlobalZoeziDispatch, useGlobalZoeziTrackedState, wipeCurrentContext } from "../contexts/GlobalContext"
import { ZoeziQueryClient } from "../utils/queryclient";
import { baseTeacherLinkState, isTeacherDisplayLinkExposedState } from "../_pages/TeacherDisplayPage";

const Navigation = () => {
    const { 
        authToken,
        isTeacher,
        communicationId
    } = useGlobalZoeziTrackedState();
    const dispatch = useGlobalZoeziDispatch();

    const [baseTeacherLink,setbaseTeacherLink] = useRecoilState(baseTeacherLinkState);
    const [isTeacherDisplayLinkExposed, setisTeacherDisplayLinkExposed] = useRecoilState(isTeacherDisplayLinkExposedState);


    return (
        <>
            <ul id="dropdown1" className="dropdown-content lighten-2 hide-on-med-and-down">
                {
                    isTeacher ? null :
                    <li>
                        <Link to="/dashboard" className="black-text">Profile</Link>
                    </li>
                }
                <li><Link to={isTeacher ? `/teacher/edit/${communicationId}` : "/account"} className="black-text">Settings</Link></li>
                <li className="divider"></li>
                {/* just log out the person by wiping the current context */}
                <li><a onClick={_ => {
                    wipeCurrentContext(dispatch);
                    // reset all the queries in react query ( wipe them out :))
                    ZoeziQueryClient.removeQueries('in_app_');
                    setbaseTeacherLink(null);
                    setisTeacherDisplayLinkExposed({ myGrades: false, mySubjects: false });
                }} className="black-text">Sign Out</a></li>
            </ul>

            <div className="navbar-fixed">

            <nav className="white sub-names" role="navigation">
                {/* the banner */}
                <div className="nav-wrapper" style={{margin: "0 auto", maxWidth: "1280px", width: "90%"}}>
                    
                    <Link to="/" id="logo-container" className="brand-logo materialize-red-text sub-headings">
                        <span className="teal-text">ZO</span>EZ<span className="teal-text">I</span>
                    </Link>

                    {authToken ?
                        <ul className="right hide-on-med-and-down">
                            { isTeacher && baseTeacherLink ? <>
                                <li hidden={!isTeacherDisplayLinkExposed.myGrades}><Link to={`/teacher/${baseTeacherLink}#mygrades`}>My Grades</Link></li>
                                <li hidden={!isTeacherDisplayLinkExposed.mySubjects}><Link to={`/teacher/${baseTeacherLink}#mysubjects`}>My Subjects</Link></li>
                            </> :
                                <>
                                    <li><Link to="/shop">Shop</Link></li>
                                    <li><Link to="/teacher">Teachers</Link></li>
                                    <li><Link to="/grades">Grades</Link></li>
                                    <li><Link to="/subscriptions">Subscriptions</Link></li>
                                </> 
                            }
                            <li><a className="dropdown-trigger" id="desktopprofile2" href="#!" data-target="dropdown1">My Account<i className="material-icons right">arrow_drop_down</i></a></li>
                        </ul>
                        :
                        <ul className="right hide-on-med-and-down">
                            <li><Link to="/pricing">Pricing</Link></li>
                            <li><a href="https://www.zoezieducation.com/" target="_blank" className="btn-flat" style={{
                                border: "1px solid #E51C23",
                                textTransform: "capitalize",
                            }}>Learners</a></li>
                            <li><Link to="/new-school" className="btn-flat" style={{
                                border: "1px solid teal",
                                textTransform: "capitalize",
                            }}>Create a school</Link></li>
                            <li><Link to="/login">Sign In</Link></li>
                        </ul>
                    }
                </div>
            </nav>
        </div>
        </>
    )
}

export default Navigation