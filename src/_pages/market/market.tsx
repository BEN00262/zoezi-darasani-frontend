import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { GlobalContext } from "../../contexts/GlobalContext";
import LoaderPage from "../loader";

export interface IZoeziGrade {
    _id: string
    name: string
    isSpecial: boolean
}


const MarketItem: React.FC<IZoeziGrade> = ({ _id, name, isSpecial }) => {
    const navigate = useNavigate();

    return (
         <div className="col s6 m3 l2">
            <div 
                className="card hoverable z-depth-1" 
                style={{cursor:"pointer"}}
                onClick={_ => {
                    // set the special grade choosing thing here
                    localStorage.setItem("special_grade", isSpecial ? "special": "");
                    navigate(`/shop/select/${_id}`);
                }}
            >

                <div className="card-image">
                    <img className="img-box-responsive" src={`https://www.zoezi-education.com/img/${name.toLowerCase()}.png`}/>
                </div>

                <div className="row center card-content">
                    <button className="waves-effect waves-light btn center z-depth-0" style={{
                        borderRadius: "20px",
                        paddingLeft: "30px",
                        paddingRight: "30px"
                    }}>
                        <small>
                            <b>BUY</b>
                        </small>
                    </button>
                </div>
            </div>
        </div>
    )
}


const MarketPage = () => {
    const { authToken } = useContext(GlobalContext);
    const [fetchedGrades, setFetchedGrades] = useState<IZoeziGrade[]>([]);

    // fetch the grades and display them
    useEffect(() => {
        axios.get("/api/market",  { headers: {
            'Authorization': `Bearer ${authToken}`
        }})
            .then(({ data }) => {
                if (data) {
                    setFetchedGrades(
                        [
                            ...data.normal_grades.map((x: any) => ({
                                ...x,
                                name: x.grade,
                                isSpecial: false
                            })),

                            ...data.special_grades.map((x: any) => ({
                                ...x,
                                isSpecial: true
                            }))
                        ]
                    )
                }
            })
    }, []);

    if (!fetchedGrades.length) {
        return <LoaderPage/>
    }

    return (
        <main>
             <div className="container">

                {/* grades */}
                <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                <h5 className="center sub-sub-headings">Grades</h5>
                <div className="divider"></div>

                <div className="section">
                    <div className="row">
                        <div className="col s12">
                            <div className="sub-modal-texts" style={{
                                borderLeft: "2px solid blue",
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                borderRadius: "3px",
                                lineHeight: "4em",
                                backgroundColor: "rgba(0,0,255, 0.1)",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <i className="material-icons left">info</i>
                                <p><b>Please add teachers, grades, learners and subjects before buying GRADE</b></p>
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        {fetchedGrades.map((grade, index) => {
                            return <MarketItem key={`market_item_${index}`} {...grade}/>
                        })}

                    </div>
                </div>
            </div>
        </main>
    )
}

export default MarketPage;