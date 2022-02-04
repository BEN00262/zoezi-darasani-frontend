export default interface HttpClientInterface {
    get(url:string, ...otherArgs: any[]): Promise<any>;
} 