import { useEffect, useCallback, useState, useContext, FC, useMemo } from 'react';
// @ts-ignore
import M from 'materialize-css';

import SubQuestionComp from './sub_question_comp';
import { IChildren, IQuestion } from '../rendering_engine/DataLoaderInterface';
import { IComprehensionContent, ILibraryPaperContent, INormalContent } from '../interfaces/librarypaper';
import { GlobalContext } from '../contexts/global';
import React from 'react';


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
    position: number
    sub_questions: IChildren[]
    parentId: string
    compSubQuestionPage: number
    AddInternalPaperContents: (content: INormalContent) => void
    setCorrectAnswersCount: (num:number) => void
    setAttempted: (attempted: number) => void
    savedChildren: INormalContent[]
}

// create a simple compressor for the displayed questions ( to show the answers within them )
const SubQuestionManagerComp: FC<ISubQuestionManagerComp> = React.memo(({ 
    parentId,
    position, sub_questions,
     AddInternalPaperContents, setCorrectAnswersCount, setAttempted, 
     compSubQuestionPage, savedChildren
}) => {
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
                            index={index + pages_total_done + position}
                            AddInternalPaperContents={AddInternalPaperContents}
                            setAttempted={setAttempted}
                            setCorrectAnswersCount={setCorrectAnswersCount}
                        />
                })
            }
        </>
    )
})

// find an effecient way to do this without rerendering the whole question shit
// find a way to handle control for navigation to this piece
const ComprehensionComp = ({
    question,isMarked, position, setAttempted, 
    setCorrectAnswersCount, AddPageStudentPaperContent, savedQuestion
}:{
    question: IQuestion,
    isMarked: boolean,
    position: number,
    index: number,
    savedQuestion:ILibraryPaperContent | null
    AddLibraryPaperContents:(content: ILibraryPaperContent) => void,
    setCorrectAnswersCount: (num:number) => void
    setAttempted: (attempted: number) => void
    AddPageStudentPaperContent: (question_id: string, content: ILibraryPaperContent) => void
}) => {
    const { 
        compSubQuestionPage,
        currentPage,
        attemptTree
    } = useContext(GlobalContext);

    // push the elements into this store
    const [internalPaperContent, setInternalPaperContent] = useState<INormalContent[]>([]);
    const [savedContext, setSavedContext] = useState<INormalContent[]>([]);
    const [questionText, setQuestionText] = useState(question.question);

    const is_broken_passage: boolean = useMemo(() => (question.children as IChildren[])[0].question.trim().replace(/(<([^>]+)>)/ig, "").trim().length <= 1,[question]);
    
    const hot_merge_function = is_broken_passage ? 
        merge_broken_passage_with_answers(question.question, question.children as IChildren[], position) 
        : (n:INormalContent[]) => question.question;

    const AddInternalPaperContents = (content: INormalContent) => {
        let local_internal_paper_content = [...internalPaperContent];
        let indexFound = local_internal_paper_content.findIndex(x => x.question === content.question);
        
        if (indexFound > -1) {
            local_internal_paper_content[indexFound] = content;
        } else {
            local_internal_paper_content = [...local_internal_paper_content, content] 
        }

        setInternalPaperContent(local_internal_paper_content)
    }

    useEffect(() => {
        // save this every time ( highly inefficient refactor after the launch )
        if (internalPaperContent.length > 0) {

            AddPageStudentPaperContent(question._id, {
                questionType: "comprehension",
                content: {
                    question: question._id,
                    children: internalPaperContent
                }
            });

            

            if (is_broken_passage) {
                setQuestionText(
                    hot_merge_function(internalPaperContent, isMarked)
                );
            }
        }

    }, [internalPaperContent])

    useEffect(() => {
        let elems = document.querySelectorAll(".question-comp img");
        M.Materialbox.init(elems);


        let historyFound = attemptTree.pages[currentPage].find(x => x.content.question === question._id);

        if (!historyFound) { return }

        let content = historyFound.content as IComprehensionContent

        setInternalPaperContent(content.children);
        setSavedContext(content.children);
    },[]);

    return (
        <div>
            <span
                dangerouslySetInnerHTML={{
                    __html: `<div class="question-comp">${questionText}</div>`
                }}
            ></span>

            <div style={{
                marginTop:"5px"
            }}>
                <SubQuestionManagerComp
                    AddInternalPaperContents={AddInternalPaperContents}
                    parentId={question._id}
                    position={position}
                    savedChildren={savedContext}
                    compSubQuestionPage={compSubQuestionPage}
                    setAttempted={setAttempted}
                    setCorrectAnswersCount={setCorrectAnswersCount}
                    sub_questions={question.children || []} 
                />
            </div>
        </div>
    )
}

export default ComprehensionComp;