import Dexie from 'dexie';


class ZoeziCacheDatabase extends Dexie {
    constructor (databaseName: string) {
        super(databaseName);
        this.version(1).stores({
            questions: `_id,questionType,question,options,options_next,subject,additionalInfo,children`
        });
    }
}

export default ZoeziCacheDatabase;