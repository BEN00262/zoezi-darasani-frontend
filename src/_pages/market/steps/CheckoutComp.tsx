import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IPricingItem } from "../../../components/PricingItem";
import { useGlobalZoeziTrackedState } from "../../../contexts/GlobalContext";
import { IGrade } from "../../Grades";
import LoaderPage from "../../loader";

// for toast displays
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutComp = () => {
    const { authToken } = useGlobalZoeziTrackedState();
    const navigate = useNavigate();
    const params = useParams();
    const [totalCost, setTotalCost] = useState(0);
    const [grades, setGrades] = useState<IGrade[]>([]);
    const [subscriptionPrice, setSubscriptionPrice] = useState(0);
    const [error, setError] = useState("");
    const [isPurchasing, setIsPurchasing] = useState(false);

    // on loading fetch the grades and the subscription
    useEffect(() => {
        axios.get(`/api/market/checkout/${params.subscriptionId}?grades=${localStorage.getItem("selectedGrades")}`,{
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data) {
                    const subscription = data.subscription as IPricingItem

                    setGrades(data.grades as IGrade[]);
                    setSubscriptionPrice(subscription.price);

                    setTotalCost(
                        data.grades.reduce((acc: number, x: any) => 
                            acc + (x.classRef.students.length * subscription.price)
                        , 0)
                    )
                }
            })
    }, []);


    // have a function to make the payments now
    const makePayment = () => {
        const special_grade = (localStorage.getItem("special_grade") || "").toLowerCase() === "special";

        setIsPurchasing(true);
        axios.post(`/api/market/purchase/${params.gradeId}/${params.subscriptionId}`,
        {
            grades: localStorage.getItem("selectedGrades"),
            isSpecial: special_grade
        },
        {
            headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }) => {
                if (data && data.status) {

                    (() => toast.success("Your payment is being processed", {
                        position: toast.POSITION.TOP_RIGHT,
                        className: "sub-modal-texts",
                        onClose: () => navigate("/dashboard", { replace: true }) // go back to the grades page after a success :)
                    }))();

                    return;
                }
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
            })
            .finally(() => {
                // invert the stuff
                setIsPurchasing(false);
                // do some clean ups
                localStorage.setItem("selectedGrades", "");
                localStorage.setItem("special_grade", "");
            })
    }

    if (!grades.length) {
        return <LoaderPage/>
    }

    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <ToastContainer/>
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
                                <button onClick={makePayment} disabled={isPurchasing} style={{
                                    border: "2px solid teal",
                                    backgroundColor: "teal",
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    paddingLeft: "30px",
                                    paddingRight: "30px",
                                }} className="white-text">
                                    {isPurchasing ? "Making Payment..." : "Make Payment"}
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