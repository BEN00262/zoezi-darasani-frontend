
const MarketGrade = () => {
    return (
        <main>
             <div className="container">
            <div className="section">
                <div className="row">
                    <div className="col s12 m2">
                        <div className="row center" style={{
                            borderRight: "1px solid #d3d3d3",
                        }}>
                            {/* place the class icon at the top */}
                            <img
                                style={{
                                    height: "100px",
                                    width: "100px",
                                    objectFit: "contain",
                                    border: "1px solid #d3d3d3",
                                    borderRadius: "50%"
                                }} 
                                src="https://www.zoezi-education.com/img/two.png"
                            />
                            <button className="btn-small">
                                subscribe
                            </button>
                        </div>
                    </div>
                    <div className="s12 m10">
                        <div className="row center">
                            Active Grades
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </main>
    )
}

export default MarketGrade;