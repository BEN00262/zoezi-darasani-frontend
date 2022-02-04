import { useParams } from "react-router-dom"
import GlobalErrorBoundaryComp from "./components/GlobalErrorBoundaryComp"
import HeadlessComp from "./components/HeadlessComp"
import StateWatcherComp from "./components/state_watcher"
import GlobalContextComp from "./contexts/global"


// we can just set this as a page i think so
const SpecialPaperLibraryPaper = () => {
    const params = useParams();

    localStorage.setItem("remainingTime", '0');

    return (
        <main>
            <div className="container">
                <GlobalContextComp>
                    <GlobalErrorBoundaryComp>
                        <HeadlessComp 
                            gradeName={params.gradeName || ""} 
                            paperID={params.paperID || ""}
                            savedStateID={params.savedStateID || ""}
                            studentId={params.studentId || ""}
                        />
                        <StateWatcherComp/>
                    </GlobalErrorBoundaryComp>
                </GlobalContextComp>
            </div>
        </main>
    )
}

export default SpecialPaperLibraryPaper