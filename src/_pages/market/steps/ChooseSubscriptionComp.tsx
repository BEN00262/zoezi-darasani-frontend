import axios from 'axios';
import { useEffect, useState } from 'react';
import PricingItem, { IPricingItem } from '../../../components/PricingItem';
import { useGlobalZoeziTrackedState } from '../../../contexts/GlobalContext';

export interface ISubscription {
    _id: string,
    defaultPrice: boolean,
    pricingType: string,
    price: number,
    features: string[]
}

export interface IChooseSubscriptionComp {
    setSelectedSubscription: (item: IPricingItem) => void
}

const ChooseSubscriptionComp: React.FC<IChooseSubscriptionComp> = ({ setSelectedSubscription }) => {
    // get the subscriptions for the schools and display them here :)
    const { authToken } = useGlobalZoeziTrackedState();
    const [selectBitmap, setSelectBitmap] = useState<boolean[]>([]);
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);

    useEffect(() => {
        axios.get("/api/market/subscriptions", {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data){
                    const _subscriptions = data as ISubscription[]
                    setSubscriptions(_subscriptions);
                    setSelectBitmap(new Array(_subscriptions.length).fill(false));
                }
            })
    }, []);

    const handleClick = (position: number) => {
        const copy = new Array(subscriptions.length).fill(false);
        copy[position] = true;
        setSelectBitmap(copy);
    }

    return (
        <div id="select-subscription" className="modal bottom-sheet">
            <div className="modal-content">
                <h4 className='center sub-modal-texts'>Choose subscription</h4>
                <div className="container">
                    <div className="row">
                        {subscriptions.map((pricingItem, index) => {
                            return (
                                <PricingItem
                                    key={index}
                                    pricingItem={pricingItem}
                                    position={index}
                                    isClicked={selectBitmap[index]}
                                    setClicked={handleClick}
                                    setClickedOption={setSelectedSubscription}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">Select</a>
            </div>
        </div>
    )
}

export default ChooseSubscriptionComp