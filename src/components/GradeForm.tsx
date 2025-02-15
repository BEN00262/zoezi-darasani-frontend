const GradeFormComp = () => {
    return (
        <form action="/new-learner/?_csrf=<%=csrftoken%>" className="contactustext" method="POST" encType="multipart/form-data">
            <div className="row">
                {/* <!-- profile pic upload place --> */}
                <div className="input-field">
                    <div style={{position: "relative", width: "250px", margin: "auto" }}>
                        <img 
                            id="profile-pic-preview"
                            style={{
                                filter:"brightness(50%)",
                                height: "200px",
                                width: "200px",
                                objectFit: "contain",
                                borderRadius: "50%"
                            }}
                            src="https://cdn2.iconfinder.com/data/icons/child-people-face-avatar-3/500/child_152-512.png"/>
                    
                        <div style={{position: "absolute",bottom: "85px",right: "50px"}}>
                            <label
                                htmlFor="profile-pic-upload" 
                                id="profile-pic-label2" 
                                className="sub-modal-texts btn-small waves-effect waves-light"
                            ><i className="material-icons left">camera_alt</i>profile picture</label>
                            {/* onchange="showPreview(event);" */}
                            <input type="file" name="profilePic" id="profile-pic-upload" accept="image/*" style={{display: "none"}} /> 
                        </div>
                    </div>
                </div>

                {/* <!-- end of profile pic upload place --> */}
                <div className="input-field col s6">
                    <input id="first_name" name="firstname" type="text" className="validate contactustext"/>
                    <label htmlFor="first_name">First Name</label>
                </div>

                <div className="input-field col s6">
                    <input id="last_name" name="lastname" type="text" className="validate contactustext"/>
                    <label htmlFor="last_name">Last Name</label>
                </div>

                <div className="input-field col s12 m6">
                    <input id="grade_id" name="grade" type="text" className="validate contactustext"/>
                    <label htmlFor="grade_id">Current Grade / className</label>
                    {/* <!-- <span className="helper-text left-align" data-error="wrong" data-success="right">Use a valid Safaricom phone number</span> --> */}
                </div>

                <div className="input-field col s12 m6">
                    <input id="school_id" name="school" type="text" className="validate contactustext"/>
                    <label htmlFor="school_id">Current School</label>
                    <span className="helper-text left-align" data-error="wrong" data-success="right">Enter the full name of the school</span>
                </div>

            </div>

            <div className="input-field">
                <input type="hidden" name="_csrf" value="<%= csrftoken %>"/>
            </div>

            {/* onclick="loaderOverlay();" */}
            <button className="waves-effect waves-light btn sub-names materialize-red" style={{width:"40%"}} type="submit">ADD LEARNER</button>
        </form>
    )
}

export default GradeFormComp