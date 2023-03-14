// @ts-ignore
import M from "materialize-css"
import axios from "axios"
import { useEffect, useState } from "react"
import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext"


interface ISubscription {
    gradeName: string
    isExpired: boolean
    date: Date
    daysRemaining: string
}

const SubcriptionsDisplay = () => {
    const { authToken } = useGlobalZoeziTrackedState();
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);

    useEffect(() => {
        // attach the materialize js stuff :)
        M.Collapsible.init(
            document.querySelectorAll('.collapsible')
        )

        const classId = localStorage.getItem("classId") || "";
        axios.get(`/api/grade/subscriptions/${classId}`,{
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setSubscriptions(data.subscriptions as ISubscription[]);
                    return;
                }
            })
    }, [])


    return (
        <div className="section">
            {/* what if there are no subscriptions */}
            {
                !subscriptions.length ? 
                <div className="row">
                    <div className="col s12 center">
                        <h6 className="sub-names">The grade does not have any active subscriptions</h6>
                    </div>
                </div>
                : null
            }

            {subscriptions.map((subscription, index) => {
                return (
                    <div className="col s12 m6" key={`subscription_${index}`}>
                        <div className="hoverable" style={{
                            border: "1px solid #d3d3d3",marginBottom: "5px",
                            padding:"5px",borderRadius: "2px"
                            }}>
                            <span
                                className="sub-modal-texts" 
                                style={{
                                    backgroundColor: subscription.isExpired ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,0,0.3)', 
                                    border: `1px solid ${subscription.isExpired ? 'red' : 'green'}`,
                                    borderRadius: "10px",
                                    paddingLeft: "10px",paddingRight: "10px"
                                }}
                            >
                            {subscription.isExpired ? 'Expired' : 'Active'}
                            </span>
                            <br/>
            
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <img className="img-box-responsive" style={{height: "80px"}} src="https://www.zoezieducation.com/img/two.png"/>
                            </div>
                            <br/>
                            <span className="sub-modal-texts">
                                {subscription.isExpired ? 'Expired ' : 'Expires in '} {subscription.daysRemaining}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SubcriptionsDisplay