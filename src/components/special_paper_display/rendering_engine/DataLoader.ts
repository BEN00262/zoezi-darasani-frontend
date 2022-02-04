import { Observable } from 'rxjs';
import DataLoaderInterface, { IQuestion } from './DataLoaderInterface';
import ZoeziCacheDatabase from './DixieDb';
import HttpClientInterface from './HttpClientInterface';

class DataLoader implements DataLoaderInterface {
    private readonly httpClient: HttpClientInterface;
    private readonly baseURL: string;
    private readonly dixieInstance: any;

    constructor(baseURL:string,databaseName: string,httpClient: HttpClientInterface){
        this.httpClient = httpClient;
        this.baseURL = baseURL;
        this.dixieInstance = new ZoeziCacheDatabase(databaseName);
        this._initDixieDB();
    }

    private async _initDixieDB(){ await this.dixieInstance.open(); }

    // what we do is fetching the paper then doing someother things later
    // we just get the paper id then move on to set everything up
    // once fetched we can refetch it unless we load another paper

    getQuestions(num: number): Observable<IQuestion[]> {
        const self = this;
        // @ts-ignore
        return new Observable(subscriber => {
            self._fetchFromIndexedDB(num)
                .then(results => {
                    subscriber.next(results);
                    subscriber.complete();
                })
                .catch(error => {
                    subscriber.error(error.message);
                })
        })
    }

    private async _fetchFromIndexedDB(num: number): Promise<IQuestion[]>{
        let tableElementLength = await this.dixieInstance.questions.count();

        if ( tableElementLength <= num ) { await this._fetchFromInternet(num); }

        let fetchedQuestions: IQuestion[] = [];
        let hasComprehension:boolean = false; // this is a small hack will resolve it later

        // not optimal at all
        // @ts-ignore
        await this.dixieInstance.questions.limit(num).each(question => {
            if (!hasComprehension && (question.questionType === 'comprehension')){
                fetchedQuestions = [
                    question
                ];
                hasComprehension = true;
            }else if(!hasComprehension){
                fetchedQuestions.push(question);
            }
        });

        this.dixieInstance.questions
            .where('_id')
            .anyOf(...fetchedQuestions.map(x => x._id))
            .delete();

        this._post_fetch_questions_from_internet(num);

        return fetchedQuestions;
    }

    private async _post_fetch_questions_from_internet(num: number){
        let tableElementLength = await this.dixieInstance.questions.count();
        if ( tableElementLength <= num ) { await this._fetchFromInternet(num); }
    }
    
    private async _fetchFromInternet(num: number){
        try {
            let dataFetched = await this.httpClient.get(`${this.baseURL}/${num}`).then(({data}) => data);
            this.dixieInstance.questions.bulkPut(dataFetched);
        }catch(error){
            console.error(error);
        }
    }
}

export default DataLoader;