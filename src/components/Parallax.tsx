// @ts-ignore
import M from "materialize-css"
import { useEffect } from "react"
import BannerImage from "../img/background.svg";
import DarasaniBanner from "../img/darasani.png";

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
                            <img src={DarasaniBanner} alt="student using computers" className="img-responsive" style={{
                                // border: "1px solid #efefef",
                                height: "400px",
                                // boxShadow: "10px 10px 8px 10px #888888"
                            }}/>
                        </div>
                        <br/><br/>
                    </div>
                </div>
                 <div className="parallax">
                    <div className="postergrad">
                        <img src={BannerImage} alt="student using computers" className="img-responsive"/>
                    </div>
                </div>
            </div>
    )
}

export default ParallaxComp