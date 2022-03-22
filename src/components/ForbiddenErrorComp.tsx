import { useRecoilState } from "recoil"
import { ForbiddenErrorState, useGlobalZoeziDispatch, wipeCurrentContext } from "../contexts/GlobalContext"
import { ZoeziQueryClient } from "../utils/queryclient";


const ForbiddenErrorComp = () => {
    const dispatch = useGlobalZoeziDispatch();
    const [forbiddenError, setForbiddenError] = useRecoilState(ForbiddenErrorState);

    return (
        <>
            {
                forbiddenError ?
                <div style={{margin: "0 auto", maxWidth: "1280px", width: "90%"}}>
                    <div className="section">
                        <div className="row">
                            <div className="col s12">
                                <div className="sub-modal-texts" style={{
                                    borderLeft: "2px solid red",
                                    paddingLeft: "5px",
                                    paddingRight: "5px",
                                    borderRadius: "3px",
                                    lineHeight: "4em",
                                    backgroundColor: "rgba(255,0,0, 0.1)",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}>
                                    <i className="material-icons left">error_outline</i>
                                    <p>{forbiddenError}</p>
                                    <button className="btn-flat sub-modal-texts red-text" onClick={_ => {
                                        setForbiddenError(null);
                                    }}>
                                        <b>ignore</b>
                                    </button>
                                    <button className="btn-flat sub-modal-texts green-text" onClick={_ => {
                                        // and thats it :)
                                        ZoeziQueryClient.removeQueries('in_app_');
                                        wipeCurrentContext(dispatch);
                                        setForbiddenError(null);
                                    }}>
                                        <b>re log in</b>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null
            }
        </>
    )
}

export default ForbiddenErrorComp;