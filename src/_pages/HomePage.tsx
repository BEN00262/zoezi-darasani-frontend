// import dynamic from "next/dynamic"
import ParallaxComp from "../components/Parallax";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';

// features images
import AccessLearnerLibraryImage from "../img/Access Learner Library.png"
import AddClassTeachersImage from "../img/Add Class Teachers.png"
import ClassAndLearnerPerformanceAnalysis from "../img/classandlearnerperfomanceanalysis.png";
import CreateGradeImage from "../img/Create Grade .png";
import MonitorLearnerPerfomanceImage from "../img/Monitor Learner Performance.png"
import SelfServiceShopingImage from "../img/Self Service Shoping .png";

interface IFeature { title: string, imagePath: string }

const Features: IFeature[] = [
    {
        title: "Learner's Library",
        imagePath: AccessLearnerLibraryImage
    },
    {
        title: "Add Class Teachers",
        imagePath: AddClassTeachersImage
    },
    {
        title: "Class And Learner Performance Analysis",
        imagePath: ClassAndLearnerPerformanceAnalysis
    },
    {
        title: "Create Grade",
        imagePath: CreateGradeImage
    },
    {
        title: "Monitor Learner Performance",
        imagePath: MonitorLearnerPerfomanceImage
    },
    {
        title: "Self Service Shoping",
        imagePath: SelfServiceShopingImage
    }
]

const FeatureComp: React.FC<{ title: string, imagePath: string }> = ({ title, imagePath }) => {
    return (
        <SplideSlide>
            <div
                style={{
                    objectFit: "contain",
                    height: "100%",
                    border: `1px solid #d3d3d3`,
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1),rgba(0, 0, 0, 0.6)) , url("${imagePath}")`,
                    backgroundSize: 'cover',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                className="white-text"
            >
                <img src={imagePath} hidden={true} />
                <h4 className="sub-names teal-text" style={{
                    border: `1px solid teal`, //${colors[Math.floor(Math.random() * colors.length)]}
                    padding: "2px 10px"
                }}>{title}</h4>
                <div className="center" style={{
                    width: "80%"
                }}>
                    <p className="sub-modal-texts">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur reiciendis qui nulla inventore enim non itaque natus vero eum dignissimos, illo excepturi delectus maxime placeat dolor corrupti doloremque amet at!</p>
                </div>
            </div>
        </SplideSlide>
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
                            <h3><i className="mdi-content-send brown-text"></i></h3>
                            <h4 className="sub-names">Features</h4>
                        </div>
                        <div className="col s12">
                            <Splide options={ {
                                rewind: true,
                                gap   : '1rem',
                                autoplay: true,
                                lazyLoad: "nearby",
                                // autoHeight: true
                                height: 400,
                                // heightRatio: 0.3
                            }}>
                                {
                                    Features.map((feature, index) => {
                                        return <FeatureComp {...feature} key={`feature_${index}`}/>
                                    })
                                }
                            </Splide>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HomePage