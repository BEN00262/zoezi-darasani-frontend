import { useContext, useEffect } from "react"
import { GlobalContext } from "../contexts/global"
import { IComprehensionContent, INormalContent, IPagePaperStudentTree } from "../interfaces/librarypaper";

const markTree = (tree: IPagePaperStudentTree) => {
    let passed =  0;

    Object.entries(tree.pages).forEach(([page, elements]) => {

        passed += elements.reduce((acc, element) => {

            switch(element.questionType) {
                case 'normal':
                    {
                        let content = element.content as INormalContent
                        acc += content.status ? 1 : 0;
                        break;
                    }
                case 'comprehension':
                    {
                        let content = element.content as IComprehensionContent

                        acc += content.children.reduce((acc, _child) => {
                            let child = _child as INormalContent
                            acc += child.status ? 1 : 0;
                            return acc;
                        }, 0);
                        break;
                    }
            }


            return acc
        }, 0)

    })

    return passed;
}

const StateWatcherComp = () => {
    const {
        attemptTree,
        isMarked,
        isLibraryPaper,

        // @ts-ignore
        updateTotalScore, switchCongratsOff,
    } = useContext(GlobalContext);

    useEffect(() => {
        if (isMarked) {
            updateTotalScore(markTree(attemptTree));

            if (!isLibraryPaper) {
                switchCongratsOff(true);
            }
        }
    }, [isMarked]);

    return null
}

export default StateWatcherComp