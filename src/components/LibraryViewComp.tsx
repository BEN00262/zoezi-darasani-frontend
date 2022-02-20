// @ts-ignore
import M from 'materialize-css';
import axios from "axios";
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import SadKid from "../img/sad-kid.png"



const LibraryViewComp: React.FC<{ studentId: string }> = ({ studentId }) => {
    const navigate = useNavigate();
    const { authToken } = useContext(GlobalContext);

    // continue to work on the library and also on the papers to finally create the link btwn the papers :)
    const [library, setLibrary] = useState<any[]>([]);

    useEffect(() => {
        const classId = localStorage.getItem("classId") || "";

        axios.get(`/api/library/${classId}/${studentId}`, {
            headers: { Authorization: `Bearer ${authToken}`}
        }).then(({ data }) => {
            if (data) {
                // console.log(data);
                setLibrary(data.library || []); // we will type this thing later

                // attach the materialize js stuff :)
                M.Collapsible.init(
                    document.querySelectorAll('.collapsible')
                )

                return;
            }
        })

    }, []);


    return (
        <main>
            <div>
                <div className="section">
                    {!library.length ?
                        <div className="row center">
                            <div className="col s12">
                                <img src={SadKid} height="200px" />
                                <p className="sub-names">The student has an empty library. They haven't tried any papers</p>
                            </div>
                        </div>

                            :

                            <div className="row">

                                {library.map(({_id: date, papers, special_papers, howManyDaysAgo }, parentIndex) => {
                                    return (
                                        <React.Fragment key={`parent_${parentIndex}`}>
                                            <h3 className="hide-on-small-only"><i className="mdi-content-send brown-text"></i></h3>
                                            <h6 className="sub-sub-headings">
                                                {new Date(date).toDateString()} ( {howManyDaysAgo} )
                                            </h6>
                                            <div className="divider"></div>

                                            <ul className="collapsible expandable z-depth-0">
                                                {/* <!-- for the non special papers --> */}
                                                {papers.map(({grade, papers: innerPapers }: {
                                                    grade: any
                                                    papers: any[]
                                                }, index: number) => {
                                                        return (
                                                            <li key={`normal_paper_${index}`}>
                                                        {/* <!-- <div className="row"> --> */}
                                                        <div className="collapsible-header" style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center"
                                                        }}>
                                                            <img 
                                                                className="img-box-responsive" 
                                                                style={{
                                                                    objectFit: "contain",
                                                                    height:"40px",
                                                                    width:"40px"
                                                                }}
                                                                src={`http://www.zoezi-education.com/img/${grade.toLowerCase()}.png`}/>
                                                            <p className="sub-modal-texts" style={{
                                                                marginLeft: "5px",
                                                                fontWeight: "bolder",
                                                                }}>
                                                                <span style={{
                                                                    border: "1px solid #651fff",
                                                                    borderRadius:"10px",
                                                                    paddingRight:"10px", 
                                                                    paddingLeft: "10px",
                                                                    backgroundColor: "rgba(101,31,255, 0.2)",
                                                                    whiteSpace: "nowrap"
                                                                }}>
                                                                    {innerPapers.length} paper (s)
                                                                </span>
                                                            </p>
                                                        </div>



                                                        <div className="collapsible-body" style={{padding: "1px",marginTop: "5px"}}>
                                                            <div className="row">
                                                                {innerPapers.map(({ subject, score: {passed, total}, _id }, index) => {
                                                                    return (
                                                                        <div className="col s6 m3 l2" key={`inner_${index}`}>
                                                                            <div className="hoverable" 
                                                                                // we need to fetch the student id btw 
                                                                                onClick={_ => navigate(`/library-paper/${studentId}/${_id}`)}
                                                                                style={{
                                                                                    backgroundColor: "#fffde7",
                                                                                    marginBottom: "5px",
                                                                                    cursor: "pointer",
                                                                                    border: "1px solid #d3d3d3",
                                                                                    borderRadius: "2px",
                                                                                    padding: "4px"
                                                                                }}
                                                                            >

                                                                                <div className="center">

                                                                                    <span className="sub-names truncate"><b>{subject}</b></span>
                                                                                    <br/>
                                                                                    <span className="sub-modal-texts teal-text truncate" style={{
                                                                                        backgroundColor: "#fff",
                                                                                        border: "1px solid #d3d3d3",
                                                                                        padding: "4px",
                                                                                        borderRadius: "2px"
                                                                                    }}>
                                                                                    <b>{subject.toLowerCase().includes("kiswahili") ? "ALAMA: " : "SCORE: "}{' '}{passed}/{total}</b>
                                                                                </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </li>
                                                        )
                                                    })                
                                                                
                                                }

                                                {/* <!-- for the special papers --> */}
                                                {special_papers.map(({_id: { gradeName, secondTier, category }, papers: spapers }: {
                                                    _id: { gradeName: string, secondTier: string, category: string },
                                                    papers: any[]
                                                }, index: number) => {
                                                    return (        
                                                        <li key={`random_${index}`}>
                                                            {/* <!-- <div className="row"> --> */}
                                                            <div className="collapsible-header" style={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                alignItems: "center"
                                                            }}>
                                                                <img 
                                                                    className="img-box-responsive" 
                                                                    style={{ 
                                                                        objectFit: "contain", height: "40px", width: "40px"
                                                                    }}
                                                                    src={`https://www.zoezi-education.com/img/${gradeName.toLowerCase()}.png`}
                                                                />
                                                                {/* <!-- trying to style this things --> */}
                                                                <p className="sub-modal-texts" style={{
                                                                    marginLeft: "5px",
                                                                    fontWeight: "bolder"
                                                                }}>
                                                                    <span style={{
                                                                        border: "1px solid #15ccbd",
                                                                        borderRadius:"10px",
                                                                        paddingRight: "10px",
                                                                        paddingLeft: "10px",
                                                                        backgroundColor: "rgba(21,204,189, 0.2)",
                                                                        whiteSpace: "nowrap"
                                                                    }}>
                                                                        {secondTier}
                                                                    </span> 
                                                                    &nbsp;|&nbsp; 
                                                                    <span style={{
                                                                        border: "1px solid #ffa726",
                                                                        borderRadius:"10px",
                                                                        paddingRight: "10px",
                                                                        paddingLeft: "10px",
                                                                        backgroundColor: "rgba(255,167,38, 0.2)",
                                                                        whiteSpace: "nowrap"
                                                                        }}>
                                                                        {category}
                                                                    </span> 
                                                                    &nbsp;|&nbsp; 
                                                                    <span style={{
                                                                        border: "1px solid #651fff",
                                                                        borderRadius:"10px",
                                                                        paddingRight: "10px",
                                                                        paddingLeft: "10px",
                                                                        backgroundColor: "rgba(101,31,255, 0.2)",
                                                                        whiteSpace: "nowrap"
                                                                    }}>
                                                                        {spapers.length} paper (s)
                                                                    </span>
                                                                </p>
                                                            </div>
            
            
            
                                                            <div className="collapsible-body" style={{
                                                                padding: "1px",
                                                                marginTop: "5px" 
                                                            }}>
                                                                <div className="row">
                                                                    {spapers.map(({ grade, subject, scores: {passed, total}, _id, paperID, historyID }) => {
                                                                        return (
                                                                            <div className="col s6 m3 l2" key={`${_id}`}>
                                                                                <div className="hoverable"
                                                                                    // /library-paper/special/:studentId/:gradeName/:paperID/:savedStateID
                                                                                    onClick={_ => navigate(`/library-paper/special/${studentId}/${gradeName}/${paperID}/${historyID}`)}
                                                                                    style={{
                                                                                        backgroundColor: "#fffde7",
                                                                                        marginBottom: "5px",
                                                                                        cursor: "pointer",
                                                                                        border: "1px solid #d3d3d3",
                                                                                        borderRadius: "2px",
                                                                                        padding: "4px"
                                                                                    }}
                                                                                >
                
                                                                                    <div className="center">
                
                                                                                        <span className="sub-names truncate"><b>{subject}</b></span>
                                                                                        <br/>
                                                                                        <span className="sub-modal-texts teal-text truncate" style={{
                                                                                            backgroundColor: "#fff",
                                                                                            border: "1px solid #d3d3d3",
                                                                                            padding: "4px",
                                                                                            borderRadius: "2px"}}>
                                                                                            <b>
                                                                                            {subject.toLowerCase().includes("kiswahili") ? "ALAMA: " : "SCORE: "}{' '}{passed}/{total}
                                                                                            </b>
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )    
                                                })}
                                            </ul>

                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        }
                </div>
            </div>
        </main>
    )
}

export default LibraryViewComp