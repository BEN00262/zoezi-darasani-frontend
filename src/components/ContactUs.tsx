const ContactUs = () => {
    return (
        <div>

            <div>

            <div className="row black-text ">

                <div className="col s12 m8 center grey lighten-2 section scrollspy" id="aboutussection">
                <h3><i className="mdi-content-send brown-text"></i></h3>
                <h4 className="sub-names">About Us</h4>
                <p className="light"><b>
                ZOEZI DARASANI is an ICT-integrated teaching & learning platform with revision content for primary schools in Kenya. The content includes randomised CBC and 8-4-4 questions, answers and revision notes, KCPE Past & Model papers, and Social Emotional Learning (SEL) quizzes for the CBC grades. It offers a personalised revision model that enables self-paced learning experience. DARASANI provides an ICT-enabled classroom solution that puts the learner at the centre of the learning process. It is a digital tool that parents can use to track and monitor their child’s learning progress, at any time.
                </b></p>
                </div>

                <div className="col s12 m4 center section scrollspy" id="contactusparent">
                    <div className="col s12 center">
                        <h3><i className="mdi-content-send brown-text"></i></h3>
                        <h4 className="sub-names">Talk to Us</h4>
                    </div>
                    <p className="light"><i className="im im-mail" style={{verticalAlign: "-6px",fontSize:"20px"}}></i> <a href="mailto:inquiries@zoezi-education.com" style={{color: "black"}}><b>inquiries@zoezi-education.com</b></a><br/><i className="im im-mobile" style={{verticalAlign: "-6px",fontSize:"20px"}}></i> <a href="tel:+254115815941" style={{color: "black"}}><b>+254115815941</b></a></p>

                    <a href="https://wa.me/254115815941" target="_blank" style={{
                        marginRight: "4px"
                    }} rel="noreferrer"><img className="img-responsive" src="https://www.zoezi-education.com/img/socials/wa.svg" height={31} width={31}/></a>
                    <a href="https://web.facebook.com/zoezi.platform" style={{
                        marginRight: "4px"
                    }} target="_blank" rel="noreferrer"><img className="img-responsive" src="https://www.zoezi-education.com/img/socials/fb.svg" height={31} width={31}/></a>
                    
                    <a href="https://www.linkedin.com/in/zoezi-education-86a1951a9" style={{
                        marginRight: "4px"
                    }} target="_blank" rel="noreferrer"><img className="img-responsive" src="https://www.zoezi-education.com/img/socials/ln.svg" height={31} width={31}/></a>
                    <a href="https://twitter.com/Zoezi_Education?s=09" target="_blank" rel="noreferrer"><img className="img-responsive" src="https://www.zoezi-education.com/img/socials/tw.svg" height={31} width={31}/></a>
                </div>
            </div>
            </div>
            </div>
    )
}

export default ContactUs