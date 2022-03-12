import { useEffect, useCallback, useState, useContext, FC, useMemo } from 'react';
// @ts-ignore
import M from 'materialize-css';

import SubQuestionComp from './sub_question_comp';
import { IChildren, IQuestion } from '../special_paper_display/rendering_engine/DataLoaderInterface';
import { IComprehensionContent, ILibraryPaperContent, INormalContent } from '../special_paper_display/interfaces/librarypaper';
import { GlobalContext } from '../special_paper_display/contexts/global';
import { group_questions, ISubQuestionManagerComp, merge_broken_passage_with_answers } from '../special_paper_display/components/comprehension_question_comp';
import { useRecoilValue } from 'recoil';
import { selectedQuestionAtom } from '.';


// create a simple compressor for the displayed questions ( to show the answers within them )
const SubQuestionManagerComp: FC<ISubQuestionManagerComp> = ({ 
    parentId,
    position, 
    sub_questions, 
    setCorrectAnswersCount, 
    setAttempted,
    savedChildren
}) => {
    const {
        compSubQuestionPage,
        currentPage
    } = useContext(GlobalContext);

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
                            AddInternalPaperContents={(n: INormalContent) => {}}
                            setAttempted={setAttempted}
                            setCorrectAnswersCount={setCorrectAnswersCount}
                        />
                })
            }
        </>
    )
}

// find an effecient way to do this without rerendering the whole question shit
// find a way to handle control for navigation to this piece
const ComprehensionComp = ({
    question,isMarked, position, setAttempted, 
    setCorrectAnswersCount
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
    const selectedQuestionId = useRecoilValue(selectedQuestionAtom);
    const [internalPaperContent, setInternalPaperContent] = useState<INormalContent[]>([]);
    const [savedContext, setSavedContext] = useState<INormalContent[]>([]);
    const [questionText, setQuestionText] = useState(question.question);
    const [reRender, setReRender] = useState(-1);

    const is_broken_passage: boolean = useMemo(() => (question.children as IChildren[])[0].question.trim().replace(/(<([^>]+)>)/ig, "").trim().length <= 1,[question]);
    
    const hot_merge_function = is_broken_passage ? 
        merge_broken_passage_with_answers(question.question, question.children as IChildren[], position) 
        : (n:INormalContent[]) => question.question;

    useEffect(() => {
        if (internalPaperContent.length > 0) {
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

    useEffect(() => {
        setReRender(Math.random());
        console.log(`The current sub page is ${compSubQuestionPage}`);
    }, [currentPage]);

    return (
        <div style={{
            border: selectedQuestionId === question._id ? '1px solid red' : 'inherit',
            padding: selectedQuestionId === question._id ? '4px' : 'inherit'
        }}>
            <span
                dangerouslySetInnerHTML={{
                    __html: `<div class="question-comp">${questionText}</div>`
                }}
            ></span>

            <div style={{
                marginTop:"5px"
            }}>
                <SubQuestionManagerComp
                    key={reRender}
                    parentId={question._id}
                    position={position}
                    savedChildren={savedContext}
                    setAttempted={setAttempted}
                    setCorrectAnswersCount={setCorrectAnswersCount}
                    sub_questions={question.children || []} 
                />
            </div>
        </div>
    )
}

export default ComprehensionComp;