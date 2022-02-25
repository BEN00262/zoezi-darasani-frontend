import { useState, useCallback, useEffect, useContext, useMemo } from 'react';
import { Card, Button } from 'react-materialize';
import { useMediaQuery } from 'react-responsive';

import NormalQuestionComp from '../../special_paper_display/components/normal_question_comp';
import ComprehensionComp from '../../special_paper_display/components/comprehension_question_comp';
import OldVersionQuestion from '../../special_paper_display/components/old_version_question';
import { IQuestion } from '../../special_paper_display/rendering_engine/DataLoaderInterface';
import { IComprehensionContent, ILibraryPaperContent, INormalContent } from '../../special_paper_display/interfaces/librarypaper';
import { GlobalContext } from '../../special_paper_display/contexts/global';
import TimerComp from '../../special_paper_display/components/TimerComp';

const QuestionComp = ({ questions, alreadyDone, isKiswahili, wasTimed }:{
    questions:IQuestion[]
    alreadyDone: number
    isKiswahili: Boolean
    wasTimed: boolean
}) => {
    const {
        subject:subjectName, 
        currentPage,
        totalPages,
        attemptTree,
        questionsPerPage,
        numOfQuestions,
        isMarked,
        compSubQuestionPage,

        // @ts-ignore
        updatePageNumber, setIsMarked, setCurrentSubPage, updateStudentTreeContentAtAndMove
    } = useContext(GlobalContext);

    const [isSafeToProceed, setIsSafeToProceed] = useState<boolean>(false);
    const [numberAttempted, setNumberAttempted] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
    const [libraryPaperContent, setLibraryPaperContent] = useState<ILibraryPaperContent[]>([]);
    const [isComprehensionQuestion, _] = useState<boolean>(questions.length === 1 ? questions[0].questionType ? questions[0].questionType === "comprehension" ? true : false : false : false)

    // we also need a way to fetch the actual from the system on loading of this somehow :)
    const [pageStudentPaperContent, setPageStudentPaperContent] = useState<{
        [page: number]: ILibraryPaperContent[]
    }>({ [currentPage]: [] });

    // let isComprehensionQuestion = useMemo(() => questions.length === 1 ? questions[0].questionType ? questions[0].questionType === "comprehension" ? true : false : false : false, [currentPage]);
    let number_of_questions = useMemo(() => isComprehensionQuestion ? questions[0].children?.length : questions.length, [currentPage]);
    
    let actual_number_of_subpages = useMemo(() => {
        if (!isComprehensionQuestion)
            return 0;
        return Math.floor((number_of_questions || 0) / 5) + (((number_of_questions || 0) % 5) > 0 ? 1 : 0);
    },[currentPage]);

    const findAlreadyDoneHistory = (previous_snapshot: ILibraryPaperContent[]) => {
        return previous_snapshot.reduce((acc, snapshot) => {
            switch (snapshot.questionType) {
                case 'normal':
                    {
                        let content = snapshot.content as INormalContent
                        acc += content.attempted_options.length > 0 ? 1 : 0
                        break
                    }
                case 'comprehension':
                    {
                        let comprehensionQuestion = snapshot.content as IComprehensionContent

                        acc += comprehensionQuestion.children.slice(
                            compSubQuestionPage * 5, (compSubQuestionPage * 5) + 5
                        ).reduce((acc, _snapshot) => {
                            let _child_snapshot = _snapshot as INormalContent
                            return acc + (_child_snapshot.attempted_options.length > 0 ? 1 : 0)
                        }, 0);

                        break
                    }
            }

            return acc
        }, 0);
    }

    const findCumulativeTotal = (previous_snapshot: ILibraryPaperContent[]) => {
        return previous_snapshot.reduce((acc, snapshot) => {
            switch (snapshot.questionType) {
                case 'comprehension':
                    {
                        let comprehensionQuestion = snapshot.content as IComprehensionContent

                        acc += comprehensionQuestion.children.slice(
                            0, (compSubQuestionPage > 0 ? (compSubQuestionPage - 1) * 5  + 5 : compSubQuestionPage)
                        ).reduce((acc, _snapshot) => {
                            let _child_snapshot = _snapshot as INormalContent
                            return acc + (_child_snapshot.attempted_options.length > 0 ? 1 : 0)
                        }, 0);

                        break
                    }
            }

            return acc
        }, 0);
    }

    const totalAlreadyDone = useMemo(() => {
        if (isComprehensionQuestion) {
            return findCumulativeTotal(attemptTree.pages[currentPage]) + alreadyDone + numberAttempted
        }

        return numberAttempted + alreadyDone
    },[numberAttempted, currentPage]);

    const isLastPage = useMemo(() => {
        if (isComprehensionQuestion) {
            return findCumulativeTotal(attemptTree.pages[currentPage]) + alreadyDone + numberAttempted === numOfQuestions
        }

        return (numberAttempted + alreadyDone) === numOfQuestions
    }, [numberAttempted, currentPage, questionsPerPage, numOfQuestions]);

    let compFullPages = useMemo(() => isComprehensionQuestion ? Math.floor((number_of_questions || 0) / 5) : 1, [questions])

    const AddPageStudentPaperContent = (question_id: string,content: ILibraryPaperContent) => {
        let local_paper_tree = pageStudentPaperContent[currentPage];

        let foundIndex = local_paper_tree.findIndex(x => x.content.question === question_id);

        if (foundIndex < 0) {
            setPageStudentPaperContent({
                [currentPage]: [
                    ...local_paper_tree,
                    content
                ]
            });

            return 
        }

        local_paper_tree[foundIndex] = content;
        setPageStudentPaperContent({
            ...pageStudentPaperContent,
            [currentPage]: local_paper_tree
        });
    }

    const comprehensionDone = useMemo(() => {
        if (isComprehensionQuestion) {
            let pages_done = 0;
            let number_of_page_questions = 0;

            if (compSubQuestionPage > compFullPages) {
                number_of_page_questions = (number_of_questions || 0) % 5;
                pages_done = compFullPages
            } else {
                pages_done = compSubQuestionPage
            }

            return (pages_done * 5) + number_of_page_questions
        }

        return 0
    }, [questions])

    // TODO: find the rendering bug somehow :(
    // what if we use this state to push the time up i think
    useEffect(() => {
        let previous_snapshot = attemptTree.pages[currentPage];

        setAttempted(findAlreadyDoneHistory(previous_snapshot));

        setPageStudentPaperContent({
            ...pageStudentPaperContent,
            [currentPage]: previous_snapshot
        })
    }, [currentPage])


    useEffect(() => {
        setAttempted(findAlreadyDoneHistory(attemptTree.pages[currentPage]));
    }, [compSubQuestionPage])

    useEffect(() => {
        if (isSafeToProceed) {
            proceedToNextPage()
        }
    }, [isSafeToProceed])

    const proceedToNextPage = () => {
        if (isComprehensionQuestion) {
            let questions_on_last_page = (number_of_questions || 0) % 5;
            let comprehension_sub_pages = compFullPages + (questions_on_last_page > 0 ? 1 : 0);

            let next_sub_page = compSubQuestionPage + 1;

            if (next_sub_page < comprehension_sub_pages) {
                // get the number of questions done here
                setCurrentSubPage(next_sub_page);

                // we should be able to also send 
                updateStudentTreeContentAtAndMove(-Infinity, next_sub_page, currentPage, pageStudentPaperContent[currentPage]);
                return;
            }

        }

        let next_page = currentPage + 1

        if (next_page < totalPages) {
            updateStudentTreeContentAtAndMove(next_page, -Infinity, currentPage, pageStudentPaperContent[currentPage]);
        }
    }

    const AddLibraryPaperContents = useCallback(
        () => {
            return (content: ILibraryPaperContent) => {
                setLibraryPaperContent(previousState => [...previousState, content])
            }
        },[])()

    const isTabletOrMobileDevice = false; // useMediaQuery({ query:"(min-width: 601px)" });

    const setAttempted = (attempted: number) => {
        setNumberAttempted(
            numberAttempted + attempted
        );
    }

    const incrementCorrectQuestionCount = (num: number) => {
        setCorrectAnswersCount(
            previous_count => previous_count + num
        )
    }

    // we need to find something out of this buana
    const findQuestion = useCallback((questionID: string) => {
        let page = (pageStudentPaperContent[currentPage] || []) as ILibraryPaperContent[];
        return page.find(x => x.content.question === questionID) || null;
    }, [currentPage]);


    const selectQuestionType = (question:IQuestion,index:number) => {
        switch(question.questionType){
            case 'normal':
                return <NormalQuestionComp
                            setAttempted={setAttempted}
                            AddPageStudentPaperContent={AddPageStudentPaperContent}
                            key={index} 
                            setCorrectAnswersCount={incrementCorrectQuestionCount}
                            AddLibraryPaperContents={AddLibraryPaperContents}
                            question={question} 
                            savedQuestion={findQuestion(question._id)}
                            position={index + alreadyDone} 
                            isMarked={isMarked}/>
            case 'comprehension':
                return <ComprehensionComp 
                    setAttempted={setAttempted}
                    key={index}
                    index={index}
                    savedQuestion={findQuestion(question._id)}
                    position = {index + alreadyDone}
                    AddPageStudentPaperContent={AddPageStudentPaperContent}
                    question={question} 
                    AddLibraryPaperContents={AddLibraryPaperContents}
                    setCorrectAnswersCount={incrementCorrectQuestionCount}
                    isMarked={isMarked}/>
            default:
                // backwards compatibility ( we dont expect this )
                return <OldVersionQuestion 
                    setAttempted={setAttempted} 
                    setCorrectAnswersCount={incrementCorrectQuestionCount}
                    AddLibraryPaperContents={AddLibraryPaperContents}
                    key={index} 
                    question={question} 
                    position={index + (currentPage * questionsPerPage)} 
                    isMarked={isMarked}/>
        }
    }

    return (
        <>
            {/* this part is unnecesarily rerendered */}
            <div className="white" style={{
                display: "flex",
                flexDirection: "row",
                justifyContent:"space-between",
                borderRadius:"2px",
                // boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                padding:"5px 6px",
                border: "1px solid #d3d3d3",
                position:"sticky",
                // marginTop:"55px",
                top: isTabletOrMobileDevice ? 64.2 : 64,
                zIndex:2,
            }}>
                    <button
                        className="waves-effect waves-light btn-small z-depth-0"

                        // enable it for even comprehension papers
                        // modify this to allow for navigation ( somehow )
                        disabled={currentPage === 0 && compSubQuestionPage === 0}

                        onClick={() => {
                            if (isComprehensionQuestion) {

                                if (compSubQuestionPage !== 0){
                                    updateStudentTreeContentAtAndMove(
                                        -Infinity,
                                        compSubQuestionPage > 0 ? compSubQuestionPage - 1: compSubQuestionPage, 
                                        currentPage, 
                                        // i think the error is here :)
                                        pageStudentPaperContent[currentPage]
                                    );
                                    return
                                }
                            }

                            let previous_sub_page_count = 0;

                            let next_full_page = currentPage > 0 ? currentPage - 1 : currentPage;

                            // get the full number of questions there
                            let prev_page = attemptTree.pages[next_full_page];

                            if (prev_page && (prev_page[0].questionType === 'comprehension')) {
                                let local_number_of_questions = (prev_page[0].content as IComprehensionContent).children.length
                                previous_sub_page_count = Math.floor((local_number_of_questions || 0) / 5) + (((local_number_of_questions || 0) % 5) > 0 ? 1 : 0)
                            }

                            previous_sub_page_count -= previous_sub_page_count > 0 ? 1 : 0;

                            // this was supposed to do that :) it aint
                            updateStudentTreeContentAtAndMove(
                                next_full_page, 
                                previous_sub_page_count, 
                                currentPage, 
                                pageStudentPaperContent[currentPage]
                            );

                            updatePageNumber(next_full_page);
                        }}
                    >
                        <i className="material-icons">arrow_back</i>
                    </button>

                    {/* display the time here */}
                    {/* depends on the type of the paper the student clicked ( a paper can be timed but i dont want to do it in timed mode ) */}
                    {/* we should check if the paper was started in timed mode */}
                    {
                        !isMarked ? 
                            wasTimed ?
                                <TimerComp onTimeUp={() => {
                                    // what do we do here ( set is marked to true )
                                    // console.log("Time is up")
                                    setIsMarked(true);
                                }}/>
                            :
                            <input
                                disabled
                                type="range"
                                min="0"

                                // this will not work in this part ( the questions per page is a complex value now )
                                value={`${totalAlreadyDone}`}
                                max={numOfQuestions} 
                                style={{
                                    flex: 1,
                                    marginRight:"3px",
                                    alignSelf:"center",
                                    background:"#000"
                                }}
                            />
                        : null
                    }

                    <div hidden={isMarked} className="teal white-text z-depth-1" style={{
                        alignSelf:"center",
                        padding:"5px",
                        borderRadius:"4px"
                    }}>
                        <b>
                            {/* we have more questions esp in the comprehension part */}
                            {`${numberAttempted + alreadyDone + comprehensionDone}/${numOfQuestions}`}
                        </b>
                    </div>

                    <div hidden={!isMarked}>
                        <button disabled={(() => {
                            if (isComprehensionQuestion) {
                                let questions_on_last_page = (number_of_questions || 0) % 5;
                                let comprehension_sub_pages = compFullPages + (questions_on_last_page > 0 ? 1 : 0)
                                return (compSubQuestionPage + 1 === comprehension_sub_pages) && ((currentPage + 1) === totalPages)
                            }

                            return (currentPage + 1) === totalPages
                        })()} onClick={() => {

                            if (isComprehensionQuestion) {
                                let next_sub_page = compSubQuestionPage + 1;

                                if (next_sub_page < actual_number_of_subpages) {
                                    setCurrentSubPage(next_sub_page);
                                    return;
                                }

                            }


                            let next_page = currentPage + 1

                            if (next_page < totalPages) {
                                updatePageNumber(next_page)
                            }

                        }} className="waves-effect waves-light z-depth-0 btn-small">
                            <i className="material-icons">arrow_forward</i>    
                        </button>
                    </div>
            </div>



            <div id="zoeziPaper">
            <Card
                style={{
                    marginTop: "13px",
                    border: "1px solid #d3d3d3"
                }}
                className="z-depth-0"

                header= {
                    <div className="card-image">
                        <div className="postergrad">
                            <img alt="" style={{
                                maxWidth:"100%",
                                height:"84px",
                                objectFit:"cover",
                            }} src="https://www.zoezi-education.com/img/background2.webp"/>
                        </div>
                        <span className="card-title text-center sub-names truncate text-bold teal">{
                            `${subjectName}`
                        }</span>
                    </div>
                }
            >
                <form onSubmit={(e) => {
                    e.preventDefault();

                    if (isComprehensionQuestion) {
                        if (compSubQuestionPage < compFullPages) {
                            if (numberAttempted !== 5){
                                // we dont need this part at all
                                // alert.info(isKiswahili ? "Tafadhali jibu maswali yote" : "complete all the questions");
                                return;
                            }

                        } else {
                            let remainders = ((number_of_questions || 0) % 5)

                            if (numberAttempted !== remainders){
                                // alert.info(isKiswahili ? "Tafadhali jibu maswali yote" : "complete all the questions");
                                return;
                            }
                        }
                    } else {
                        if (numberAttempted !== number_of_questions){
                            // alert.info(isKiswahili ? "Tafadhali jibu maswali yote" : "complete all the questions");
                            return;
                        }

                    }

                    setIsSafeToProceed(true);

                    if (isLastPage) {
                        setIsMarked(true);
                    }
                }
                }>
                    { questions.map((question: IQuestion,index: number) => selectQuestionType(question,index)) }
                </form>
            </Card>
            </div>
        </>
    )
}

export default QuestionComp;