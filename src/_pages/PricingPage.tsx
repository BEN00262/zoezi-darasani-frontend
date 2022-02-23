import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyComp from "../components/Empty";
import LoaderPage from "./loader";
import { ISubscription } from "./market/steps/ChooseSubscriptionComp";

export interface IPricingItem {
    _id: string
    defaultPrice: boolean
    pricingType: string
    price: number
    features: string[]
}



const PricingItem: React.FC<IPricingItem> = ({ 
    _id, defaultPrice, pricingType, price, features
}) => {
    const navigate = useNavigate();

    return (
        <div className="col s12 m6 l3">
            <div className="card hoverable z-depth-1 darken-1" onClick={
                _ => navigate("/new-school")
            } style={{ cursor: "pointer" }}>
            <div className="card-content black-text">

                {defaultPrice ?
                <p className="orange accent-2 center" style={{borderRadius: "2px",marginBottom: "4px"}}>
                    MOST POPULAR
                </p> : null }

                <span className="card-title center sub-names"><b>{pricingType.toUpperCase()}</b></span>
                <div className="center">

                    <h5 className="sub-names"><span className="sub-modal-texts">Ksh.</span><b>{price}</b></h5>
                    <h6 className="sub-names"><u>Features</u></h6>


                    <ul  className="descriptions sub-modal-texts">
                        {
                            features.map((feature, featureIndex) => <li key={`feature_${featureIndex}`}>{feature}</li>)
                        }
                    </ul>
                </div>
                <div className="row">
                    <div className="col s12">
                        <button style={{
                            width: "100%"
                        }} className="btn z-depth-0 green">
                            SUBSCRIBE
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

const PricingPage = () => {
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setIsFetching(true);

        axios.get("/api/market/subscriptions")
            .then(({ data }) => {
                if (data){
                    let _subscriptions = data as ISubscription[]
                    setSubscriptions(_subscriptions);
                    return;
                }

                throw new Error("Unexpected error!");
            })
            .catch(error => {
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

                    <div className="row center">
                    <div className="col s12">
                        <h3><i className="mdi-content-send brown-text"></i></h3>
                        <h5 className="sub-names">Our Plans</h5>
                        <p className="sub-modal-texts"><b>Zoezi Darasani</b> enables schools to integrate technology in teaching and learning.</p>
                    </div>
                        {
                            subscriptions.length ?
                                <>
                                    {
                                        subscriptions.map((subscription, index) => {
                                            return <PricingItem {...subscription} key={`subscription_item_${index}`}/>
                                        })
                                    }
                                </>
                            : <EmptyComp message="Failed to fetch subscriptions :("/>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default PricingPage