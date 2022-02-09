import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { GlobalContext } from "../../contexts/GlobalContext";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

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
                    navigate(`/market/select/${_id}`);
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

    return (
        <main>
             <div className="container">

                {/* grades */}
                <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                <h5 className="center sub-sub-headings">Grades</h5>
                <div className="divider"></div>

                <div className="section">
                    <div className="row">

                        {
                            fetchedGrades.length ? null : <div>
                                <Skeleton count={5} height={30}/>
                            </div>
                        }

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