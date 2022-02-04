import { IDataPoint, IProgressData } from "./interfaces/interfaces"

export const zip = (...datapoints: IProgressData[]) => {
    return Array.from(
        Array(Math.max(...datapoints.map(x => x.progress.length), 0)),
        (_, datapointIndex) => datapoints.map(y => ({...(y.progress[datapointIndex] || {} as IDataPoint)}))
    )
}