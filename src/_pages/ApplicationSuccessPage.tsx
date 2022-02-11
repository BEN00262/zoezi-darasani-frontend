import { useLocation } from "react-router-dom"
import ApprovedImage from "../img/approved.png"

const ApplicationSuccessPage = () => {
    // check from where we have come from 
    // if it aint the sign up page we just return a 404 :)

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="container">
                <div className="section">
                    <div className="row center">
                        <img src={ApprovedImage} alt="received for approval" className="img-responsive" />
                        <h3 className="sub-names">Application received successfully!</h3>
                        <p className="sub-modal-texts">Your application is successful. Check your email for confirmation.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

// the page sent after the application has been sent successfully for review
export default ApplicationSuccessPage