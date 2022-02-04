import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IPricingItem } from "../../../components/PricingItem";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { IGrade } from "../../Grades";

const CheckoutComp = () => {
    const { authToken } = useContext(GlobalContext);
    const params = useParams();
    const [totalCost, setTotalCost] = useState(0);
    const [grades, setGrades] = useState<IGrade[]>([]);
    const [subscriptionPrice, setSubscriptionPrice] = useState(0);

    // on loading fetch the grades and the subscription
    useEffect(() => {
        axios.get(`/api/market/checkout/${params.subscriptionId}?grades=${localStorage.getItem("selectedGrades")}`,{
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    let subscription = data.subscription as IPricingItem

                    setGrades(data.grades as IGrade[]);
                    setSubscriptionPrice(subscription.price);

                    setTotalCost(
                        data.grades.reduce((acc: number, x: any) => 
                            acc + (x.classRef.students.length * subscription.price)
                        , 0)
                    )
                }
            })
            // .finally(() => localStorage.setItem("selectedGrades", ""))
    }, []);


    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <div className="container">
                <div className="section">
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
                                    grades.map((grade, index) => {
                                        return (
                                            <tr key={`item_${index}`}>
                                                <td>{grade.name} | {grade.stream} | {grade.year}</td>
                                                <td>{grade.classRef?.students.length || 0}</td>
                                                <td>{subscriptionPrice}</td>
                                                <td>{(grade.classRef?.students.length || 0) * subscriptionPrice}</td>
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
                                }}>{totalCost} <span style={{
                                    fontSize: "20px"
                                }}>.00</span> </span>
                            </div>
                        </div>
                        <div className="row center">
                            <div className="col s12">
                                <button style={{
                                    border: "2px solid teal",
                                    backgroundColor: "teal",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    paddingLeft: "30px",
                                    paddingRight: "30px",
                                }} className="white-text">
                                    Make Payment
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    )
}

export default CheckoutComp;