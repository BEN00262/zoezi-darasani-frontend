// import dynamic from "next/dynamic"
import ParallaxComp from "../components/Parallax"


// display the home page for zoezi schools :)
const HomePage = () => {
    return (
        <main>
            <ParallaxComp/>
            <div className="container">
                <div className="section">
                    <div className="row center">
                    <h6 className="teal-text">KARIBU</h6>
                    <h5 className="materialize-red-text" style={{letterSpacing: "2px"}}>Empowering The Learning Community</h5>
                    </div>
                </div>
            </div>
            {/* features we offer */}
            <div className="container">
                <div className="section">

                <div className="row center">
                    <div className="col s12 m4">
                        <div className="icon-block">
                            <h2 className="center teal-text"><i className="material-icons">flash_on</i></h2>
                            <h5 className="center sub-names">Self-Serviced</h5>

                            <p className="light">ZOEZI DARASANI is a self-serviced platform that offers you an opportunity to create your school with a click of a button. Upon creating the school, the teacher or admin can create a class, and assign class & subject teachers. Class teachers will add learners per class – including streams. Learners’ usernames and passwords are auto-generated and can be exported (downloaded) in Excel format.</p>
                        </div>
                    </div>

                    <div className="col s12 m4">
                        <div className="icon-block">
                            <h2 className="center teal-text"><i className="material-icons">group</i></h2>
                            <h5 className="center sub-names">Learner-Focused</h5>

                            <p className="light">Our content is learner-centred and authored by experienced teachers, editors, and exam setters & markers in Kenya. We guarantee each learner a self-paced learning experience with recording of all their interactions in the LIBRARY. Moreover, we are passionate about education and would intend to make sure every learner is prepared for today's digital world, while transforming learning using a 21st century education system.</p>
                        </div>
                    </div>

                    <div className="col s12 m4">
                    <div className="icon-block">
                        <h2 className="center teal-text"><i className="material-icons">settings</i></h2>
                        <h5 className="center sub-names">Assessment-Enabled</h5>

                        <p className="light">Using Machine Learning & Artificial Intelligence (AI), we are able to ID each learner while tracking their interaction with the platform. This enables teachers to give assignments, view scores and track/assess progress of each learner, at any time. Additionally, parents can monitor their children’s learning through the LIBRARY and REPORTS.</p>
                    </div>
                    </div>
                </div>

                </div>
            </div>
        </main>
    )
}

export default HomePage