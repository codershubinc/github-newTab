function getYearsFromDate(dateString: any) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    const diffInMilliseconds = Number(currentDate) - Number(givenDate)
    const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // Considering leap years

    return (diffInMilliseconds / millisecondsInYear).toFixed(1);
}

export default getYearsFromDate