/*
    created by johnnesta2018@gmail.com <BEN00262> for the Zoezi Education eLearning platform
*/

import { IQuestion } from "../rendering_engine/DataLoaderInterface";

interface IPageBoundaries {
    startIndex: number
    endIndex: number // this is optional
    isMulti: boolean // sets whether the page has multiple questions ( used for quick stuff )
}

export interface IPaperMap {
    pages: { [key:number]:IPageBoundaries }
}

// generate the paper map and then use it
function _generate_paper_map(raw_questions: IQuestion[], singleType: string) {
    let paperMap: number[][] = [];
    let holders = []; // an array of numbers ( question indexes )

    for(let i = 0; i < raw_questions.length; i++) {
        // we go over all the questions and check their types

        if (raw_questions[i].questionType === singleType) {
            // tumepata a comprehension question
            // check at which index we are in if its 0 we do nothing
            // we just increment the startIndex and also the end index

            if (i === 0) {
                paperMap.push([i])
                continue
            }

            // maybe we had other values in the holders first

            if (holders.length > 0) {
                // we have something lets push it first into the paperMap
                paperMap.push(holders)
                // clear the holders
                holders = []
            }

            // we dont have any holders stuff so we are good
            paperMap.push([i])
            continue
        }

        // this is a normal type of question add it then ---> check for errors
        holders.push(i)
    }

    // check if the holders is empty if not just push it into the map
    if (holders.length > 0) {
        // we have something lets push it first into the paperMap
        paperMap.push(holders)
    }

    // reorganize the pages inorder to have almost balanced pages
    // loop through the mapper and do stuff

    let _paperMap:number[][] = []

    // find a better way to do this 
    paperMap.forEach(paper_map => {
        // check the length of the map if its one we are good if not do something about it

        if (paper_map.length === 1 || paper_map.length <= 6) {
            _paperMap.push(paper_map)
            return
        }

        // here it aint do something
        // split into groups of five if not balance 
        // find a way buana
        // max questions 6
        // loop through the questions and do something about them
        let pages = []
        let holder = []

        // we know this has a length > 6
        // find the easier way to do this buana
        // kind of a multiplication
        // this should be self balancing buana --> have uniform questions across board
        let currently_consumed = 0
        let total_consumables = paper_map.length

        for (let r = 0; r < total_consumables; r++) {
            // we have consumed 5 elements
            if (currently_consumed % 5 === 0) {
                if (holder.length > 0) {
                    pages.push(holder)
                    holder = []   
                }
            }

            // push the index we had b4
            holder.push(paper_map[r])
            currently_consumed += 1
        }

        // check the length of the holder if its present 
        // if we have less than 3 elements balance the tree with previous questions
        if (holder.length < 3) {
            if (pages.length > 0) {
                // we have atleast one complete page
                // make the pages equal in there elements
                // the last element 
                let prev_page = pages[pages.length - 1]

                // the previous page can have more than one element as compared to the next page
                for (const _ in prev_page) {

                    // check if the condition has been arrived at if so just stop and break
                    // also ensure that the length is good ( but this is risky buana )
                    if (prev_page.length === holder.length || (prev_page.length - holder.length) === 1) {
                        break
                    }

                    // get the last element
                    holder.unshift(prev_page.pop())

                }

                pages[pages.length - 1] = prev_page

                pages.push(holder)

            } else {
                pages.push(holder)
            }
        } else {
            pages.push(holder)
        }

        // @ts-ignore
        _paperMap.push(...pages)
    })
    
    return _paperMap
}

// generate the actual tree ( the index is the page take the extremes on either sides as the ranges )
// find a way to run this extremely fast either in the browser or something ( but i think this is weird )
// this should be run on a paper level ---> but thats easy buana
// on finshing run the jobs

export function generate_paper_map(questions: IQuestion[]): IPaperMap {
    const raw_maps: number[][] = _generate_paper_map(questions, "comprehension")

    // the generated paper map for the zoezi paper ( used while rendering the paper )
    let paperMap: IPaperMap = { pages: {} }

    raw_maps.forEach((raw_map, index) => {
        paperMap.pages[index] = {
            startIndex: raw_map[0],
            endIndex: raw_map[raw_map.length-1] + 1,
            // this can apply to either types we should check in our display
            isMulti: raw_map.length > 1,
        }
    })

    return paperMap
}

export function get_already_done_pages_questions_total(questions: IQuestion[], paperMap: IPaperMap, currentPage: number): number {
    let already_done = 0;

    if (currentPage <= 0) {
        return already_done;
    }

    // go through the pages and collect this data
    for (let page_num = 0; page_num < currentPage;page_num++) {
        let page = paperMap.pages[page_num];
        
        already_done += questions.slice(page.startIndex, page.endIndex).reduce((acc, question) => {
            switch (question.questionType) {
                case "comprehension":
                    // we need to handle for the sub page movement
                    acc += question.children?.length || 0;
                    break;
                default:
                    // covers the normal questions and old version questions just incase
                    acc += 1;
                    break;
            }

            return acc;
        }, 0);
    }

    return already_done;
}


export function get_number_of_questions_in_paper(questions: IQuestion[]): number {
    return questions.reduce((acc, question) => {

        switch (question.questionType) {
            case "comprehension":
                acc += question.children?.length || 0;
                break;
            default:
                // covers the normal questions and old version questions just incase
                acc += 1;
                break;
        }

        return acc;
    }, 0);
}