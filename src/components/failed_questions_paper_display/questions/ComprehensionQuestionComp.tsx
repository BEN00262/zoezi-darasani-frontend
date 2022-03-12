import React, { useEffect, useCallback, useState, useContext, FC, useMemo } from 'react';
// @ts-ignore
import M from 'materialize-css';

import SubQuestionComp from './sub_question_comp';
import { IChildren } from '../../special_paper_display/rendering_engine/DataLoaderInterface';
import { INormalContent } from '../../special_paper_display/interfaces/librarypaper';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { ITopFailedChildrenStats, ITopFailedPaperQuestion, studentsWhoPartcipatedState, totalStudentsInSubject } from '../../TopFailedQuestions';
import { compSubQuestionPageState } from '..';
import { Link } from 'react-router-dom';


// helper for segmenting the sub questions
type GROUP_QUESTIONS_FT = (contigous_questions: IChildren[]) => IChildren[][]

// using the sliding window algorithm to compute the pages
const group_questions: GROUP_QUESTIONS_FT = (contigous_questions: IChildren[]) => {
    let page_size = 5;
    let remainder = contigous_questions.length%page_size;
    let page_count = Math.floor(contigous_questions.length / page_size) + (remainder > 0 ? 1 : 0)

    let book = new Array(page_count).fill([] as IChildren[]);

    for (let r = 0; r < page_count; r++){
        // push a page into the book
        book[r] = contigous_questions.slice(
            r * page_size,
            r * page_size + page_size
        )
    }

    return book
}

// a next day event move
interface ISubQuestionManagerComp {
    sub_questions: IChildren[]
    parentId: string
    savedChildren: INormalContent[]
}

// create a simple compressor for the displayed questions ( to show the answers within them )
const SubQuestionManagerComp: FC<ISubQuestionManagerComp> = React.memo(({ 
    parentId, sub_questions,savedChildren
}) => {
    const compSubQuestionPage = useRecoilValue(compSubQuestionPageState);

    // pass the context of the current sub page and use it :)

    const findSubQuestion = useCallback((questionID: string) => {
        return savedChildren.find(x => x.question === questionID) || null
    }, [sub_questions]);

    let sub_pages = useMemo(() => group_questions(sub_questions || []), [sub_questions]);
    let current_sub_page = sub_pages[compSubQuestionPage];
    
    let pages_total_done = sub_pages.slice(0,compSubQuestionPage).reduce((acc, x) => {
            return acc + x.length;
        }, 0);

    return (
        <>
            {
                current_sub_page.map((child,index) => {
                    return <SubQuestionComp 
                            parentId={parentId}
                            key={index} 
                            question={child}
                            savedState={findSubQuestion(child._id)}
                            index={index + pages_total_done}
                        />
                })
            }
        </>
    )
});

export const isBrokenPassageState = atom({
    key: 'isBrokenPassageId',
    default : false
})

export const subQuestionsContextState = atom<ITopFailedChildrenStats[]>({
    key: "subQuestionsContextStateId",
    default: []
})

// find an effecient way to do this without rerendering the whole question shit
// find a way to handle control for navigation to this piece
const ComprehensionQuestionComp: React.FC<ITopFailedPaperQuestion> = ({
    question, failed, students: studentsTotal, children_stats, paperName, questionPosition, paperID
}) => {
    // push the elements into this store
    const setIsBrokenPassage = useSetRecoilState(isBrokenPassageState);
    const setSubQuestionsContext = useSetRecoilState(subQuestionsContextState);
    const studentsWhoParticipated = useRecoilValue(studentsWhoPartcipatedState);
    const [savedContext, setSavedContext] = useState<INormalContent[]>([]);
    const [questionText, setQuestionText] = useState(question.question);
    const [reRender, setReRender] = useState(-1);
    const compSubQuestionPage = useRecoilValue(compSubQuestionPageState);
    const totalStudentsInSubjectValue = useRecoilValue(totalStudentsInSubject);

    useEffect(() => {
        let elems = document.querySelectorAll(".question-comp img");
        M.Materialbox.init(elems);
    },[]);

    useEffect(() => {
        setReRender(Math.random());
    }, [compSubQuestionPage]);

    useEffect(() => {
        if (children_stats.length) {
            // only set if we have something otherwise dont :)
            setSubQuestionsContext(children_stats);
        }
    }, [children_stats]);

    useEffect(() => {
        setIsBrokenPassage(
            (question.children as IChildren[])[0].question.trim().replace(/(<([^>]+)>)/ig, "").trim().length <= 1
        )
    }, [question])

    return (
        <div>
            {
                paperName && (questionPosition && questionPosition > 0) && paperID ? 
                <div className='center' style={{
                    marginTop: "8px"
                }}>
                     <Link to={`/view-paper/${paperID}/${question._id}`}>
                        <span className='sub-modal-texts teal-text' style={{
                            border: "1px solid #d3d3d3",
                            padding: "5px 15px",
                            cursor: "pointer"
                        }}> <b>{paperName} | Number {questionPosition}</b> </span>
                    </Link>
                </div>
                : null
            }
            <span
                dangerouslySetInnerHTML={{
                    __html: `
                    <div>
                        <div>
                            <span class="sub-modal-texts green-text" style="margin-left:5px;">
                                <b>[ Attempted by ${studentsTotal} (${((studentsTotal/(totalStudentsInSubjectValue || 1))*100).toFixed(0)}%) student(s) ]</b>
                            </span>
                        </div>
                        <div class="question-comp">${questionText}</div>
                    </div>`
                }}
            ></span>

            <div style={{
                marginTop:"5px"
            }}>
                <SubQuestionManagerComp
                    key={reRender}
                    parentId={question._id}
                    savedChildren={savedContext}
                    sub_questions={question.children || []} 
                />
            </div>
        </div>
    )
}

export default ComprehensionQuestionComp;