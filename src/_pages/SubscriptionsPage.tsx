import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext"
import LoaderPage from "./loader";

interface ISubscription {
    // price: number
    _id: string
    subscriptionItem: string
    grades: {
        name: string
        // students: number
    }[]
    subscriptionType: string
    isActive: boolean
    remainingTime: string
}


const SubscriptionItem: React.FC<ISubscription> = ({ _id, subscriptionItem, subscriptionType, grades, isActive, remainingTime }) => {
    const navigate = useNavigate();
    const color = isActive ? "green" : "red";


    return (
        <div className="col s12 m3" style={{
            marginBottom: "5px"
        }}>
            <div className="hoverable" style={{
                border: "1px solid #d3d3d3",
                borderTop: `4px solid ${color}`,
                borderRadius: "5px",
                padding: "5px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <span style={{
                        // padding: "1px",
                        paddingRight: "15px",
                        paddingLeft: "15px",
                        // paddingTop: "1px",
                        // paddingBottom: "1px",
                        borderRadius: "20px",
                        border: `1px solid ${color}`,
                    }}>
                        {isActive ? "active" : "expired"}
                    </span>
                    <small>{remainingTime}</small>
                </div>
                <div className="center">
                    <img
                            style={{
                                height: "100px",
                                width: "100px",
                                objectFit: "contain",
                                border: "1px solid #d3d3d3",
                                borderRadius: "50%"
                            }} 
                            src={`https://www.zoezi-education.com/img/${subscriptionItem.toLowerCase()}.png`}
                        />
                    <h5 className="center sub-names">{subscriptionType}</h5>
                    <h6 className="center sub-modal-texts">{grades.length} grade(s)</h6>
                </div>
                <button onClick={_ => {
                    navigate(`/subscriptions/${_id}`)
                }} className="btn-flat sub-modal-texts" style={{
                    width: "100%",
                    border: `1px solid ${color}`,
                    borderRadius: "20px"
                }}>
                    <b>view subscription</b>
                </button>
            </div>     
        </div>  
    )
}

const SubscriptionsPage = () => {
    const { authToken } = useContext(GlobalContext);
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);

    useEffect(() => {
        axios.get("/api/subscriptions", {
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data && data.subscriptions) {
                setSubscriptions(data.subscriptions as ISubscription[]);
                return;
            }
        })
    }, []);

    if (!subscriptions.length) {
        return <LoaderPage/>
    }


    return (
        <main>
            <div className="container">
                <div className="section">
                    <div className="row">         
                        {
                            subscriptions.map((subscription, index) => {
                                return <SubscriptionItem {...subscription} key={`subscription_item_${index}`}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SubscriptionsPage