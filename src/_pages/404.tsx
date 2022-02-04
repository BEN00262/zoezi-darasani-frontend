const ErrorPage = () => {
    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="container">
                <div className="section">
                    <div className="row center">
                        <h1 className="sub-headings" style={{fontSize:"100px"}}>Oops!</h1>
                        <p className="contactustext">
                            <h5><b>404</b> | <span style={{fontSize: "16px"}}>Page Not Found</span></h5>
                        </p>
                    </div>
                
                </div>
            </div>
        </main>
    )
}

// the page sent after the application has been sent successfully for review
export default ErrorPage