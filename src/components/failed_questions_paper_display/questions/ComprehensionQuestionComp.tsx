import React, { useEffect, useCallback, useState, useContext, FC, useMemo } from 'react';
// @ts-ignore
import M from 'materialize-css';

import SubQuestionComp from './sub_question_comp';
import { IChildren } from '../../special_paper_display/rendering_engine/DataLoaderInterface';
import { INormalContent } from '../../special_paper_display/interfaces/librarypaper';
import { useRecoilValue } from 'recoil';
import { ITopFailedPaperQuestion, totalStudentsInSubject } from '../../TopFailedQuestions';
import { compSubQuestionPageState } from '..';


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

type FOUND_ANSWERS = {
    position: number,
    isCorrect: boolean,
    option: string
}

const merge_broken_passage_with_answers = (questionText: string, children: IChildren[], base_position: number = 0) => (answers_delta: INormalContent[], isMarked: boolean = false) => {
    let found_answer_positions: FOUND_ANSWERS[] = [];

    answers_delta.forEach(delta => {
        let selected_option = delta.attempted_options[0].optionID;
        let selected_option_index = delta.attempted_options[0].optionIndex;

        let worked_question = delta.question;

        for (let position = 0; position < children.length; position++) {
            let _child = children[position];

            if (_child._id === worked_question) {

                let found = _child.options.find((_option, _optionIndex) => (_option._id === selected_option) || (_optionIndex === selected_option_index));

                if (found) {
                    found_answer_positions.push({
                        position: position + 1 + base_position,
                        option: found.option,
                        isCorrect: found.isCorrect
                    })
                }

                break;
            }
        }
    });

    return found_answer_positions.reduce((acc, x) => acc.replace(
            new RegExp(`_{2,4}\\s?${x.position}\\s?_{2,4}`),
            `<span style="color:${isMarked && x.isCorrect ? "green" : "red"};"><u><b>${x.option}</b></u></span>`
        ), questionText);
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
})

// find an effecient way to do this without rerendering the whole question shit
// find a way to handle control for navigation to this piece
const ComprehensionQuestionComp: React.FC<ITopFailedPaperQuestion> = ({
    question, failed, students: studentsTotal
}) => {
    // push the elements into this store
    const [internalPaperContent, setInternalPaperContent] = useState<INormalContent[]>([]);
    const [savedContext, setSavedContext] = useState<INormalContent[]>([]);
    const [questionText, setQuestionText] = useState(question.question);
    const [reRender, setReRender] = useState(-1);
    const compSubQuestionPage = useRecoilValue(compSubQuestionPageState);
    const totalStudentsInSubjectValue = useRecoilValue(totalStudentsInSubject);

    const is_broken_passage: boolean = useMemo(() => (question.children as IChildren[])[0].question.trim().replace(/(<([^>]+)>)/ig, "").trim().length <= 1,[question]);
    
    // look into the base position thing :)
    // we might need to extract it from the actual questions themselves :)
    const hot_merge_function = is_broken_passage ? 
        merge_broken_passage_with_answers(question.question, question.children as IChildren[], 0) 
        : (n:INormalContent[]) => question.question;

    useEffect(() => {
        // save this every time ( highly inefficient refactor after the launch )
        if (internalPaperContent.length > 0) {

            if (is_broken_passage) {
                setQuestionText(
                    hot_merge_function(internalPaperContent, true)
                );
            }
        }

    }, [internalPaperContent])

    useEffect(() => {
        let elems = document.querySelectorAll(".question-comp img");
        M.Materialbox.init(elems);
    },[]);

    useEffect(() => {
        setReRender(Math.random());
    }, [compSubQuestionPage]);

    return (
        <div>
            <span
                dangerouslySetInnerHTML={{
                    __html: `
                    <div>
                        <div>
                            <span class="sub-modal-texts green-text" style="margin-left:5px;">
                                <b>[ Attempted by ${studentsTotal} (${((studentsTotal/(totalStudentsInSubjectValue || 1))*100).toFixed(0)}%) student(s) ]</b>
                            </span>
                            <span class="sub-modal-texts red-text" style="margin-left:5px;">
                                <b>[ Failed by ${((failed/studentsTotal)*100).toFixed(0)}% of the students ]</b>
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