import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { atom, useSetRecoilState } from "recoil"
import HeadlessComp from "./HeadlessComp";
import LocalContextComp from "../special_paper_display/contexts/global"
import GlobalErrorBoundaryComp from "../special_paper_display/components/GlobalErrorBoundaryComp";

export const selectedQuestionAtom = atom<string | null>({
    key: "selectedQuestionAtomId",
    default: null
})

export const toBeViewedPaperAtom = atom<string | null>({
    key: "toBeViewedPaperAtomId",
    default: null
})


const PointedQuestionPaper = () => {
    const params = useParams();
    // get the params for the selected question and the reference to the paper :)

    const setSelectedQuestionAtom = useSetRecoilState(selectedQuestionAtom);
    const setToBeViewedPaperAtom = useSetRecoilState(toBeViewedPaperAtom);
    
    useEffect(() => {
        setSelectedQuestionAtom(params.selectedQuestion || "");
        setToBeViewedPaperAtom(params.paperID || "");
    }, []);

    return (
        <main>
            <div className="container">
                <LocalContextComp>
                    <GlobalErrorBoundaryComp>
                        <HeadlessComp/>   
                    </GlobalErrorBoundaryComp>
                </LocalContextComp>
            </div>
        </main>
    )
}

export default PointedQuestionPaper