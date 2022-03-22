import axios from "axios";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import EmptyComp from "../components/Empty";
import { useGlobalZoeziTrackedState } from "../contexts/GlobalContext"
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
    status: string
    isActive: boolean
    remainingTime: string
    updatedAt: Date
}


const SubscriptionItem: React.FC<ISubscription> = ({ _id, subscriptionItem, status, subscriptionType, grades, isActive, remainingTime }) => {
    const navigate = useNavigate();

    const isFailed = status === "success" ? false : status === "pending" && isActive ? false : true 
    const color = isFailed ?  "red" : "green";

    return (
        <div className="col s12 m4" style={{
            marginBottom: "10px"
        }}>
            <div className="hoverable" style={{
                border: "1px solid #d3d3d3",
                // borderTop: `2px solid ${color}`,
                borderRadius: "5px",
                padding: "5px"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <span className="sub-modal-texts" style={{
                        // padding: "1px",
                        // paddingRight: "15px",
                        paddingLeft: "5px",
                        // paddingTop: "1px",
                        // paddingBottom: "1px",
                        // borderRadius: "20px",
                        // border: `1px solid ${color}`,
                        color
                    }}>
                        <b>{isFailed ? status === "failed" ? status : "expired" : status === "pending" ? status : "active" }</b>
                    </span>
                    {/* <small>{remainingTime}</small> */}
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    // justifyContent: "space-between",
                    alignItems: "center",
                    margin: "10px 0px"
                }}>
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
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "10px"
                    }}>
                        <h5 className="sub-names">{subscriptionType}</h5>
                        <h6 className="sub-modal-texts">{grades.length} grade(s)</h6>
                    </div>
                </div>
                <button onClick={_ => {
                    navigate(`/subscriptions/${_id}`)
                }} className="btn-flat sub-modal-texts" style={{
                    width: "100%",
                    border: `1px solid #d3d3d3`,
                    borderRadius: "20px"
                }}>
                    <b>view subscription</b>
                </button>
            </div>     
        </div>  
    )
}

// const groupBy = (items: ISubscription[], key: string) => items.reduce(
//     (result, item) => ({
//       ...result,
//       [item[key]]: [
//         ...(result[item[key]] || []),
//         item,
//       ],
//     }), 
//     {},
// );

interface ISubscriptionsGrouping { 
    updatedAt: Date
    subscriptions: ISubscription[] 
}

// we should group and then order :)
const groupByUpdatedAt = (subscriptions: ISubscription[]) => subscriptions.reduce(
    (acc, subscription) => {
        const foundPosition = acc.find(x => x.updatedAt === subscription.updatedAt);

        if (foundPosition) {
            foundPosition.subscriptions.push(subscription);
            return acc
        }

        return [
            ...acc,
            { updatedAt: subscription.updatedAt, subscriptions: [ subscription ] }
        ]
    },
    [] as ISubscriptionsGrouping[] // an array of objects
).sort((a, b) => (new Date(b.updatedAt)).getTime() - (new Date(a.updatedAt)).getTime())

const SubscriptionsPage = () => {
    const { authToken } = useGlobalZoeziTrackedState();
    const [subscriptions, setSubscriptions] = useState<ISubscriptionsGrouping[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsFetching(true);

        axios.get("/api/subscriptions", {
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => {

            if (data && data.subscriptions) {
                setSubscriptions(
                    groupByUpdatedAt(data.subscriptions as ISubscription[])
                );
                return;
            }

            throw new Error("Unexpected error!")
        })
        .catch((error: Error) => {
            setError(error.message);
        })
        .finally(() => {
            setIsFetching(false);
        })
    }, []);

    if (isFetching) {
        return <LoaderPage/>
    }


    return (
        <main>
            <div className="container">
                <div className="section">
                    {
                        error ?
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
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                        : null
                    }      
                    {
                        subscriptions.length ?
                        <>
                            {
                                subscriptions.map(({ updatedAt, subscriptions: _subscriptions}, index) => {
                                    return (
                                        <React.Fragment key={`subscriptions_grouping_${index}`}>
                                            <div className="row">
                                            <div className="col s12">
                                                <h6 className="sub-modal-texts"><b>{(new Date(updatedAt)).toDateString()}</b></h6>
                                                <div className="divider"></div>
                                            </div>
                                            </div>
                                            <div className="row">
                                            {
                                                _subscriptions.map((subscription, index) => {
                                                    return <SubscriptionItem {...subscription} key={`subscription_item_${index}`}/>
                                                })
                                            }
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </>
                        :
                        <EmptyComp message="The school doesn't have any active or past subscriptions"/>
                    }
                </div>
            </div>
        </main>
    )
}

export default SubscriptionsPage