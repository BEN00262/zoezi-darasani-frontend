interface IErrorPage {
    code: number
    message: string
}


const ErrorPage: React.FC<IErrorPage> = ({ code, message }) => {
    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="container">
                <div className="section">
                    <div className="row center">
                        <h1 className="sub-headings" style={{fontSize:"100px"}}>Oops!</h1>
                        <p className="contactustext">
                            <h5><b>{code}</b> | <span style={{fontSize: "16px"}}>{message}</span></h5>
                        </p>
                    </div>
                
                </div>
            </div>
        </main>
    )
}

ErrorPage.defaultProps = {
    code: 404,
    message: "Page Not Found"
}

// the page sent after the application has been sent successfully for review
export default ErrorPage