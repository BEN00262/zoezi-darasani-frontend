import TeacherFormComp from "../components/TeacherForm"


const NewTeacher = () => {
    return (
        <main>
            <div className="container">
                <div className="section">
                    <div className="row center">
                        <div className="col s12 m8 push-m2">
                            <TeacherFormComp/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default NewTeacher