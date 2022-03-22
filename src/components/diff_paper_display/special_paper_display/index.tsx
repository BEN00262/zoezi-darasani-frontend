import { useContext, useEffect, useState } from 'react';
import LoaderPage from '../../../_pages/loader';
import  LocalContextComp, { GlobalContext as LocalContext } from '../../special_paper_display/contexts/global';
import { generate_paper_map, get_number_of_questions_in_paper } from '../../special_paper_display/grouper/grouper';
import { IPrevState, PagedPaper } from '../../special_paper_display/rendering_engine/DataLoaderInterface';


import QuestionHOC from './QuestionHOC';
import { initialize_pages_structures } from '../../special_paper_display/components/HeadlessComp';
import GlobalErrorBoundaryComp from '../../special_paper_display/components/GlobalErrorBoundaryComp';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { currentlySavedPageNumberState, currentlySavedSubPageNumberState } from '../../SubjectAnalysisComp';

export interface IHeadlessComp {
    gradeName: string
    paperID: string
    savedStateID: string
    studentId: string
}

// we pre pass the paper and then use it down the line ( optimize it later )
export interface IPreloadedData {
    prePaper: PagedPaper
    prePrevState: IPrevState
}

// let currentlySavedPageNumber = -1;
// let currentlySavedSubPageNumber = -1;

// this is the first thing seen after the paper has been fetched from the db
// we need the tree buana to use :) and then to somehow show the 
const _DiffSpecialPaperDisplay: React.FC<IPreloadedData & { 
    gradeName: string
}> = ({ 
    gradeName,  prePaper, prePrevState, // the prev state should be indexable
}) => {
    const currentlySavedPageNumber = useRecoilValue(currentlySavedPageNumberState);
    const currentlySavedSubPageNumber = useRecoilValue(currentlySavedSubPageNumberState);

    // @ts-ignore
    const { updateQuestions, setSubjectName } = useContext(LocalContext);

    const [paper, setPaper] = useState<PagedPaper>();
    const [navigate, setNavigate] = useState(false);
    const [rerender, setRerender] = useState(-1);

    // we need to get the tree to render :)
    useEffect(() => {
        setPaper(prePaper);
        setSubjectName(prePaper?.subject || "");

        const _paperMap = generate_paper_map(prePaper?.questions || []);
        const _questions_number = get_number_of_questions_in_paper(prePaper?.questions || []);

        // save this on the top shelf :)
        const _currentlySavedPageNumber = currentlySavedPageNumber > -1 ? currentlySavedPageNumber : (prePrevState.currentPage || 0)
        const _currentlySavedSubPageNumber = currentlySavedSubPageNumber > -1 ? currentlySavedSubPageNumber : (prePrevState.compSubQuestionPage || 0)

        // do we really need the paperID really :(
        updateQuestions({
            questions: prePaper?.questions || [],
            paperMap: _paperMap,
            gradeName,
            paperID: "paperid_something", // figure something out ;)
            isLibraryPaper: true,
            paperHistoryID: prePrevState._id || "",
            currentPage: _currentlySavedPageNumber,
            compSubQuestionPage: _currentlySavedSubPageNumber,
            isMarked: prePrevState.isMarked || false,
            isTimed: (prePrevState.isTimed || paper?.isTimed) || false,
            remainingTime: prePrevState.remainingTime || 10000,// 0,
            numOfQuestions: _questions_number,
            totalPages: Object.keys(_paperMap.pages).length,

            attemptTree: {
                subject: prePaper?.subject || "",
                score: {
                    passed: prePrevState?.attemptTree?.score?.passed || 0,
                    total: prePrevState?.attemptTree?.score?.total || _questions_number
                },

                pages: prePrevState?.attemptTree?.pages || initialize_pages_structures(_paperMap, prePaper?.questions || [])
            }
        });
        setNavigate(true);
        setRerender(Math.random());
    }, [prePrevState]);

    if (!paper) {
        return <LoaderPage/>
    }

    // by default is false :)
    if (navigate) {
        return <QuestionHOC 
            wasTimed={false} key={rerender}/>
    }

    return null;
}

// the diff of the paper and then display it :)
const DiffSpecialPaperDisplay: React.FC<IPreloadedData & { 
    gradeName: string,
}> = (props) => {
    return (
        <RecoilRoot>
            <LocalContextComp>
                <GlobalErrorBoundaryComp>
                    <_DiffSpecialPaperDisplay 
                    {...props}/>
                </GlobalErrorBoundaryComp>
            </LocalContextComp>
        </RecoilRoot>
    )
};

export default DiffSpecialPaperDisplay