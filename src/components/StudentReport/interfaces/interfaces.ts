export interface IDataPoint {
    attemptTree: {
        score: {
            passed: number
            total: number   
        }
    },
    subject: string
}

export interface IProgressData {
    subject: string
    hits?: number // for the old way of data collection ( pie charts )
    progress: IDataPoint[]
}

export interface IProgressResponse {
    data: IProgressData[]
}