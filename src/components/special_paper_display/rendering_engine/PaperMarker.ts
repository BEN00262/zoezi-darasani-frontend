import { ILibraryPaperContent } from '../interfaces/librarypaper'

// this is responsible for marking zoezi timed/not timed 
// take in two trees and mark them 
// lets describe the student's tree

// place this questions in pages
interface PaperTree {
    name: string
    subject: string

    // we only feed this here --> we will rerender the pages later but using a different way
    score: {
        passed: number,
        total: number
    },

    // page num: contents of the page
    // should we do the calculations or what
    // use the question id and the unique identification for the question we want

    content: {
        [key:number]:ILibraryPaperContent[]
    }
}

export class PaperMarker {
    paperTree: PaperTree

    constructor(paperTree: PaperTree) {
        this.paperTree = paperTree
    }

    // making changes to a paper tree 
    pushToPaperTree(page: number, content: ILibraryPaperContent) {
        if (this.paperTree.content[page]) {
            this.paperTree.content[page].forEach((question_content, index) => {
                if (question_content.content.question === content.content.question) {
                    this.paperTree.content[page][index] = content
                    return
                }
            })

            this.paperTree.content[page].push(content)
            return
        }

        // if the page does not exist create it then push the library content
        this.paperTree.content[page] = [content]
    }

    persistTree() {
        // send the job to the service worker to persist it to db
    }

    markTree() {
        // fetch all the questions at once then check them 
    }
}