import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GlobalContext } from "../contexts/GlobalContext"
import LoaderPage from "./loader"

// display the pauy
interface ISubscriptionDisplay {
    grades: {
        name: string
        students: number
    }[]
    price: number
    total: number
    status: string
    transactionId: string
    remainingTime: string
    subscriptionType: string
    updatedAt: Date
    message: string
}


const SubscriptionViewPage = () => {
    const { authToken } = useContext(GlobalContext);
    const params = useParams();

    const [subscription, setSubscription] = useState<ISubscriptionDisplay>({
        grades: [], price: 0, total: 0, status: "pending", transactionId: "", remainingTime: "",
        subscriptionType: "", updatedAt: new Date(), message: ""
    })

    // we should fetch this data anyways :)
    useEffect(() => {
        axios.get(`/api/subscriptions/${params.transactionId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => {
            console.log(data);

            if (data && data.subscription) {
                setSubscription(data.subscription as ISubscriptionDisplay);
                return;
            }
        })
    }, [])

    if (!subscription.transactionId) {
        // we know that there is no data
        return <LoaderPage/>
    }

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="container">
                <div className="section">
                    <div className="row">
                        <div className="col s12 m10 sub-modal-texts left-align">
                            <span style={{
                                border: "1px solid green",
                                borderRadius: "20px",
                                padding: "1px 10px",
                                backgroundColor: "rgba(0,255,0,0.1)"
                            }}>
                            { subscription.transactionId }
                            </span>
                            {' '}|{' '}
                            <span style={{
                                border: "1px solid purple",
                                borderRadius: "20px",
                                padding: "1px 10px",
                                backgroundColor: "rgba(255,192,203,0.1)"
                            }}>
                            { subscription.status }
                            </span>
                            {' '}|{' '}
                            <span style={{
                                border: "1px solid rgb(255,165,0)",
                                borderRadius: "20px",
                                padding: "1px 10px",
                                backgroundColor: "rgba(255,165,0,0.1)"
                            }}>
                            { subscription.remainingTime }
                            </span>
                            {' '}|{' '}
                            <span style={{
                                border: "1px solid blue",
                                borderRadius: "20px",
                                padding: "1px 10px",
                                backgroundColor: "rgba(0,0,255,0.1)"
                            }}>
                            { subscription.subscriptionType }
                            </span>
                        </div>

                        <div className="s12 m2 right-align">
                            <p className="sub-modal-texts">{subscription.updatedAt}</p>
                        </div>
                    </div>
                    {/* <div className="divider"></div>
                    <br /> */}
                <div className="row">
                    <div className="col s12 m8">
                        <table className="striped sub-modal-texts">
                            <thead>
                                <tr>
                                    <th>Grade(s)</th>
                                    <th>Number of learners</th>
                                    <th>Price Per Student (Ksh.)</th>
                                    <th>Total Amount (Ksh.)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    subscription.grades.map(({ name, students }, index) => {
                                        return (
                                            <tr key={`item_${index}`}>
                                                <td>{name}</td>
                                                <td>{students}</td>
                                                <td>{subscription.price}</td>
                                                <td>{students * subscription.price}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="col s12 m4" style={{
                        borderLeft: "1px solid #d3d3d3"
                    }}>
                        <div className="row center">
                            <h4 className="sub-modal-texts"><u>Total Amount</u></h4>
                        </div>
                        
                        {/* what if we have a row with the required data */}
                        <div className="row center">
                            <div className="col s12">
                                <span style={{
                                    fontSize: "40px"
                                }} className="sub-modal-texts">ksh.</span>
                                {' '}
                                <span className="sub-names" style={{
                                    fontSize: "70px"
                                }}>{subscription.total} <span style={{
                                    fontSize: "20px"
                                }}>.00</span> </span>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    subscription.message ? 
                    <div className="row">
                        <div className="col s12">
                            <div className="sub-modal-texts" style={{
                                borderLeft: "2px solid blue",
                                paddingLeft: "5px",
                                borderRadius: "3px",
                                lineHeight: "4em",
                                backgroundColor: "rgba(0,0,255, 0.1)",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <i className="material-icons left">info_outline</i>
                                {subscription.message}
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        </div>
    </main>
    )
}

export default SubscriptionViewPage