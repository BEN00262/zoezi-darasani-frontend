import { IAttemptedPaper, IPrevState, PagedPaper } from "./DataLoaderInterface";
import HttpClientInterface from "./HttpClientInterface";

interface ServerResponse {
    status: boolean,
    paper?: PagedPaper,
    prevState?: IPrevState,
    attemptedPapers?: IAttemptedPaper[] 
}

// just take an axios thing and move on with it
class PaperFetch {
    private readonly httpClient: HttpClientInterface
    private readonly paperURL: string

    constructor(httpClient: HttpClientInterface, paperURL: string) {
        this.httpClient = httpClient
        this.paperURL = paperURL
    }

    // this fetches the paper from the backend and returns it
    // we will pass the id later for now its hardcorded buana
    // we will think about caching later

    getPaper(authToken: string) {
        // get the last element from the backend // append it
        return this.httpClient.get(this.paperURL, {
            Headers: { Authorization: `Bearer ${authToken}`}
        })
            .then(({ data }: { data?: ServerResponse }) => {
                if (!data) {
                    throw new Error("Failed to fetch paper")
                }
                // we have the data
                if (data?.status) {
                    return {
                        paper: data?.paper,
                        prevState: data.prevState || {} as IPrevState,
                        attemptedPapers: data.attemptedPapers || [] as IAttemptedPaper[]
                    }
                }
                // do whatever here now
                throw new Error("Failed to fetch paper")
            })
    }

    // fetch questions from the db in parts --> put a portion in the ui and the rest in store
    
}

export default PaperFetch