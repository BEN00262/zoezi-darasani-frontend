import LearnerFormComp from "../components/LearnerForm"


const NewLearner = () => {
    return (
        <main>
            <div className="container">
                <div className="section">
                    <div className="row center">
                        <div className="col s12 m8 push-m2">
                            <LearnerFormComp/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NewLearner