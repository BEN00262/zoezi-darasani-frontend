import { useContext } from "react"
import { GlobalContext } from "../contexts/GlobalContext"
import ContactUs from "./ContactUs"

const Footer = () => {
    const { authToken } = useContext(GlobalContext);

    return (
        <footer className="page-footer white">
            <div className="footer-copyright">

                {/* <ContactUs/> */}
                <div className="container">
                    {authToken ? null :
                        <div className="row black-text">
                            <ContactUs/>
                            <div className="divider"></div>
                        </div>
                    }
                    <div className="row center black-text">
                        <p className="text-lighten-2">
                            <small>
                                <span><a href="/termsofuse">Terms of Use</a> and <a href="/privacynotice">Privacy Notice.</a></span><br/>Copyright © {(new Date()).getFullYear()} Zoezi Education
                            </small>
                        </p>
                    </div>
                </div>
            
            </div>
        </footer>
    )
}

export default Footer