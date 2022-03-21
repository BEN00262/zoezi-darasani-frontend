import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
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
    const {
        isLoading, data: fetchedGrades, isError, error, isSuccess
    } = useQuery('in_app_shop_grades', () => {
        return axios.get("/api/market",  { headers: {
            'Authorization': `Bearer ${authToken}`
        }})
            .then(({ data }) => {
                if (data) {
                    return (
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
                    ) as IZoeziGrade[]
                }

                throw new Error("Unexpected error!");
            })
    }, { 
        enabled: !!authToken /* should only be fetched if there is an authToken ready */, 
        staleTime: 60 * 1000 * 2
    });

    if (isLoading) {
        return <LoaderPage/>
    }

    return (
        <main>
             <div className="container">
                <div className="section">
                    {
                        isError ?
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
                                    <p>{(error as Error).message}</p>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                    <div className="row">
                        <div className="col s12 welcome-font">
                            <p style={{
                                fontSize: "30px",
                            }}><span className="teal-text">Welcome to</span>{' '}<span className="materialize-red-text">Zoezi Darasani</span></p>
                        </div>
                    </div>

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
                                <p><b>Please add teachers, grades, learners and subjects before buying the grade(s) of your choice from the list below</b></p>
                            </div>
                        </div>
                    </div>

                    <div className="row">

                        {isSuccess && (fetchedGrades || []).map((grade, index) => {
                            return <MarketItem key={`market_item_${index}`} {...grade}/>
                        })}

                    </div>
                </div>
            </div>
            </div>
        </main>
    )
}

export default MarketPage;