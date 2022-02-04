const PasswordRecovery = () => {
    // check from where we have come from 
    // if it aint the sign up page we just return a 404 :)

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="container">
                <div className="section">
                    <div className="row center">
                        <div className="col s12 center">
                            <h3><i className="mdi-content-send brown-text"></i></h3>
                            <h5 className="sub-names">Account Password Recovery</h5>
                        </div>

                        <div className="col s12 m6 push-m3">
                            <form className="contactustext" method="POST">
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input id="email" required type="email" className="validate contactustext" name="email"/>
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>
                                <button className="waves-effect waves-light btn sub-names" style={{width:"100%"}} type="submit">
                                    Recover
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

// the page sent after the application has been sent successfully for review
export default PasswordRecovery