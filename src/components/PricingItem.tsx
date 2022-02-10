export interface IPricingItem {
    _id: string
    defaultPrice: boolean
    pricingType: string
    price: number
    features: string[]
}

interface IPricingCardComp {
    pricingItem: IPricingItem
    position: number
    setClicked: (position: number) => void
    isClicked: boolean
    setClickedOption: (subscription: IPricingItem) => void
}

const PricingItem: React.FC<IPricingCardComp> = ({ 
    pricingItem, position, setClicked, isClicked, setClickedOption
}) => {
    return (
        <div className="col s12 m6 l3">
            <div className="card hoverable z-depth-1 darken-1" onClick={
                _ => {
                    setClicked(position);
                    setClickedOption(pricingItem)
                }
            } style={{
                border:`1px solid ${isClicked ? "teal" : "#dcdee2"}`,
                cursor: "pointer"
            }}>
            <div className="card-content black-text">

                {pricingItem.defaultPrice ?
                <p className="orange accent-2 center" style={{borderRadius: "2px",marginBottom: "4px"}}>
                    MOST POPULAR
                </p> : null }

                <span className="card-title center sub-names"><b>{pricingItem.pricingType.toUpperCase()}</b></span>
                <div className="center">

                    <h5 className="sub-names"><span className="sub-modal-texts">Ksh.</span><b>{pricingItem.price}</b></h5>
                    <h6 className="sub-names"><u>Features</u></h6>


                    <ul  className="descriptions sub-modal-texts">
                        {
                            pricingItem.features.map((feature, featureIndex) => <li key={`feature_${featureIndex}`}>{feature}</li>)
                        }
                    </ul>
                </div>
                <div className="row">
                    <div className="col s12">
                        <button style={{
                            width: "100%"
                        }} className="btn z-depth-0">
                            select
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default PricingItem