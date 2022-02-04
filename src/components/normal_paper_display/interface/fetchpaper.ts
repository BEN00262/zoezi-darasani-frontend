import axios from "axios"
import { ILibPaperQuestions } from "./ILibPaper"


const getLibraryPaper: (baseURL: string, authToken: string) => Promise<ILibPaperQuestions | null> = (baseURL: string, authToken: string) => {
    return axios.get(baseURL, {
        headers: { Authorization: `Bearer ${authToken}`}
    })
        .then(({ data }: { data: ILibPaperQuestions | null }) => {
            return data ? data : null
        })
}

export default getLibraryPaper;