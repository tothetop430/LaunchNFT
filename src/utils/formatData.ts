export const formatDateToUTC = (unixTimestamp: number): string => {
    const date = new Date(unixTimestamp * 1000)
    const timeString = date.toLocaleString()
    return timeString
};