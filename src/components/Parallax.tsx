// @ts-ignore
import M from "materialize-css"
import { useEffect } from "react"
import { Link } from "react-router-dom";
import BannerImage from "../img/banner.png"

const ParallaxComp = () => {
    useEffect(() => {
        M.Parallax.init(document.querySelectorAll('.parallax'));
    }, []);

    return (
        <div id="index-banner" className="parallax-container valign-wrapper">
                <div className="section no-pad-bot">
                    <div className="container">
                        <br/><br/>
                        <h2 className="header center white-text banner-names" style={{letterSpacing: "2px"}}> ZOEZI DARASANI</h2>
                        <div className="row center">
                        </div>
                        <div className="row center">
                            <Link to={"/login"} id="download-button" className="btn-large waves-effect waves-light z-depth-0 main-button">Get Started</Link>
                        </div>
                        <br/><br/>

                    </div>
                </div>
                <div className="parallax">
                    <div className="postergrad">
                    <img src={BannerImage} alt="student using computers"/>
                    </div>
                </div>
            </div>
    )
}

export default ParallaxComp