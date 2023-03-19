// import dynamic from "next/dynamic"
import ParallaxComp from "../components/Parallax";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { Link } from "react-router-dom";

// features images
import AccessLearnerLibraryImage from "../img/diff.png"
import AddClassTeachersImage from "../img/Add Class Teachers.png"
// import ClassAndLearnerPerformanceAnalysis from "../img/classandlearnerperfomanceanalysis.png";
// import CreateGradeImage from "../img/Create Grade .png";
// import MonitorLearnerPerfomanceImage from "../img/Monitor Learner Performance.png"
// import SelfServiceShopingImage from "../img/Self Service Shoping .png";
import LaptopImage from "../img/darasani_laptop.png";
import Feature1 from "../img/feature1.png";
import Feature2 from "../img/feature2.png";
import Feature3 from "../img/feature3.png";
import Feature4 from "../img/feature4.png";
import EducatorBanner from '../img/educator.svg';

// import FeatureIcon from "../img/feature-icon.svg"

const TwitterComp = () => {
    return (
        <div>
            <div className="row">
                <div className="col s12 center">
                    <h3><i className="mdi-content-send brown-text"></i></h3>
                </div>

                <div className="col s12">
                    <TwitterTimelineEmbed
                        sourceType="profile"
                        screenName="Zoezi_Education"
                        options={{ height: 400 }}
                        noScrollbar
                        tweetLimit={1}
                    />
                
                </div>

            </div>
        </div>
    )
}

interface IFeature { title: string, imagePath: string, description: string }

const Features: IFeature[] = [
    {
        title: "Learner's Library",
        description: "Review and compare papers done",
        imagePath: AccessLearnerLibraryImage
    },
    {
        title: "Add Class Teachers",
        description: "Monitor learner per grade or subject performance",
        imagePath: LaptopImage
    },
    // {
    //     title: "Class And Learner Performance Analysis",
    //     description: "Learner, subject and class performance analysis",
    //     imagePath: ClassAndLearnerPerformanceAnalysis
    // },
    // {
    //     title: "Create Grade",
    //     description: "",
    //     imagePath: CreateGradeImage
    // },
    // {
    //     title: "Monitor Learner Performance",
    //     description: "",
    //     imagePath: MonitorLearnerPerfomanceImage
    // },
    // {
    //     title: "Self Service Shoping",
    //     description: "",
    //     imagePath: SelfServiceShopingImage
    // }
]

const FeatureComp: React.FC<IFeature> = ({ title, imagePath, description }) => {
    return (
        <div className="col s12 m4 center">
            <div style={{
                padding: "5px",
                borderRadius: "5px"
            }}>
                <img className="img-responsive" style={{ height:400 }} src={imagePath}/>
                <h5 className="sub-names">{title}</h5>
                <p className="sub-modal-texts">{description}</p>
            </div>
        </div>
    )
}



// display the home page for zoezi schools :)
const HomePage = () => {
    return (
        <main>

            <ParallaxComp/>

            <div className="container">
                <div className="section">
                    <div className="row center">
                        <h6 className="teal-text">KARIBU</h6>
                        <h5 className="materialize-red-text" style={{letterSpacing: "2px"}}>Technology in Classrooms</h5>
                    </div>

                    <div className="row center">
                        <Link to={"/login"} id="download-button" className="btn-large waves-effect waves-light z-depth-0">Get Started</Link>
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

                    <div className="row">
                        <div className="col s12 center">
                            <img src={EducatorBanner} alt="teacher in a classroom" style={{
                                height: 400
                            }}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12 center">
                            <h3><i className="mdi-content-send brown-text"></i></h3>
                            <h4 className="sub-names">Features</h4>
                        </div>
                        <div className="col s12">
                            <div className="row">
                                <div className="col s12 center">
                                    <p className="sub-modal-texts">Discover the Power of Our Product - Explore the Features That Set Us Apart!</p>
                                </div>
                            </div>
                            <div className="row">
                                <FeatureComp
                                    description="Detailed subject performance per learner and exam/paper."
                                    title="Learner Performance Overview"
                                    imagePath={Feature1}
                                />

                                <FeatureComp
                                    description="Access all grade-related items such as learners, subjects, performance & gender distribution anytime."
                                    title="Grade Summary"
                                    imagePath={Feature2}
                                />


                                <FeatureComp
                                    description="Access all & switch between subjects in the grade by a click of a button."
                                    title="Subjects Overview"
                                    imagePath={Feature3}
                                />
                            </div>

                            <div className="row">
                                <div className="col s0 m4"></div>

                                <FeatureComp
                                    description="Get customised & comprehensive learner report & engagement analysis."
                                    title="Learner Report & Analytics"
                                    imagePath={Feature4}
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="row center">
                        <Link to={"/login"} id="download-button" className="btn-large waves-effect waves-light z-depth-0">Get started</Link>
                    </div> */}

                    <TwitterComp/>
                </div>
            </div>
        </main>
    )
}

export default HomePage