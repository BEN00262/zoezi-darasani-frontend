// @ts-ignore
import M from 'materialize-css';
import axios from "axios";
import Select from 'react-select';
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { Link, useParams } from "react-router-dom";
import ChooseSubscriptionComp from './ChooseSubscriptionComp';
import { IPricingItem } from '../../../components/PricingItem';

interface IFetchedGrade {
    name: string
    stream: string
    year: number
    _id: string
}

// create the components as the steps
const ChooseGradesComp = () => {
    const params = useParams();
    const { authToken } = useContext(GlobalContext);

    const [unsubscribedGrades, setUnSubscribedGrades] = useState<{
        label: string
        value: string
    }[]>([]);

    // the ids of the selected stuff 
    const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
    const [selectedSubscription, setSelectedSubscription] = useState<IPricingItem | null>(null);

    // fetch all the grades that dont have a subscription to this stuff and are active
    // fetch grades from the current school that dont have the suggested 
    useEffect(() => {
        // init the modals
        M.Modal.init(document.querySelectorAll('.modal'), {});

        axios.get(`/api/market/grades/${params.gradeId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    setUnSubscribedGrades(
                        (data.grades as IFetchedGrade[]).map(x => ({
                            label: `Grade ${x.name} | ${x.stream} | ${x.year}`,
                            value: x._id
                        }))
                    )
                }
            })
    }, []);

    useEffect(() => {
        if (!!selectedGrades.length) {
            localStorage.setItem("selectedGrades", selectedGrades.join(","))
        }
    }, [selectedGrades]);

    const handleSetSelectedSubscription = (pricingItem: IPricingItem | null) => {
        M.Modal.getInstance(document.getElementById("select-subscription")).close();
        setSelectedSubscription(pricingItem);
    }


    // we can use the steps to fetch the data and other stuff :)
    // but how do we maintain the state in as much as we are going ahead :)

    return (
        <>
            <ChooseSubscriptionComp setSelectedSubscription={handleSetSelectedSubscription}/>
             <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
                <div className="container">
                    <div className="section">
                        {selectedSubscription ?
                        <div className="row center">
                            <div className="col s12">
                                <h3><i className="mdi-content-send brown-text"></i></h3>
                                <h5 className="sub-modal-texts">{selectedSubscription.pricingType} ( Ksh. {selectedSubscription.price} )</h5>
                            </div>
                        </div> : null}
                        <div className="row">
                            <div className="col s12 m6 push-m3">
                                <label>Select Grade</label>
                                <Select
                                    isMulti={true}
                                    onChange={item => {
                                        setSelectedGrades([
                                            ...item.map(x => x.value as string)
                                        ])
                                    }}
                                    options={unsubscribedGrades} 
                                    placeholder="choose grade..."/>
                            </div>
                        </div>
                        <div className="row center">
                            <a className="modal-trigger" 
                                style={{
                                    border: "1px solid #d3d3d3",
                                    paddingTop: "5px",
                                    paddingBottom: "5px",
                                    paddingRight: "20px",
                                    paddingLeft: "20px",
                                    borderRadius: "20px",
                                    marginRight: "10px"
                                }}
                                href="#select-subscription">
                                Select Subscription
                            </a>
                            <Link className="modal-trigger"
                                hidden={!(selectedGrades.length > 0 && !!selectedSubscription)} 
                                style={{
                                    border: "1px solid #d3d3d3",
                                    paddingTop: "5px",
                                    paddingBottom: "5px",
                                    paddingRight: "20px",
                                    paddingLeft: "20px",
                                    borderRadius: "20px"
                                }}
                                to={`/market/checkout/${selectedSubscription?._id}`}>
                                Proceed to checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ChooseGradesComp