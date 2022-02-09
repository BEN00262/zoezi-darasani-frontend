// @ts-ignore
import M from 'materialize-css';
import { useContext, useEffect } from "react"
import {Link} from "react-router-dom"
import { GlobalContext } from "../contexts/GlobalContext"

const Navigation = () => {
    const { 
        authToken,

        // @ts-ignore
        wipeCurrentContext
    } = useContext(GlobalContext);

    useEffect(() => {
        M.Dropdown.init(document.querySelectorAll('#desktopprofile2'), {
            hover: false,
            coverTrigger: false
        });

        return () => M.Dropdown.getInstance(document.getElementById("desktopprofile2")).destroy()
    }, []);

    return (
        <>
            <ul id="dropdown1" className="dropdown-content lighten-2 hide-on-med-and-down">
                <li><a href="" className="black-text">Settings</a></li>
                <li className="divider"></li>
                {/* just log out the person by wiping the current context */}
                <li><a onClick={wipeCurrentContext} className="black-text">Sign Out</a></li>
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
                            <li><Link to="/market">Market</Link></li>
                            <li><Link to="/teacher">Teachers</Link></li>
                            <li><Link to="/grades">Grades</Link></li>
                            <li><Link to="/subscriptions">Subscriptions</Link></li>
                            <li><a className="dropdown-trigger" id="desktopprofile2" href="#!" data-target="dropdown1">My Account<i className="material-icons right">arrow_drop_down</i></a></li>
                        </ul>
                        :
                        <ul className="right hide-on-med-and-down">
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