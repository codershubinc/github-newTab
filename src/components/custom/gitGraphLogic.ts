const contributingMessage = (cnt: number) => {
    console.log(`Contribution count: ${cnt}`);

    if (cnt === 1) {
        // Special message for exactly 1 contribution
        return 'Nice work!';
    } else if (cnt > 1) {
        // Message for contributions between 2 and 5
        return 'Awesome work!';
    } else if (cnt >= 6) {
        // Message for contributions between 6 and 7
        return 'Great work!';
    } else if (cnt >= 8) {
        // Message for contributions between 8 and 9
        return 'Excellent work!';
    } else if (cnt >= 10) {
        return 'Outstanding work!';

    } else
        // Default message for no contributions
        return '🥺 No Contributions today !!!!!';
}

const gitContribution = async (
    setTodaysContribution: any,
    setTodaysContributionMsg: any,
    setTotalContributions: any,
    setContributionData: any

) => {
    try {
        const todaysDate = new Date().getFullYear() + '-' +
            String(new Date().getMonth() + 1).padStart(2, '0') + '-' +
            String(new Date().getDate()).padStart(2, '0');
        console.log('todaysDate', todaysDate);
        console.log('Date of now = ', new Date().getDate() + '-' + Number(new Date().getMonth() + 1) + '-' + new Date().getFullYear());


        // Fetch contributions data
        const result = await fetch('https://github-contributions-api.deno.dev/codershubinc.json?flat=true&to=' + todaysDate, { cache: 'no-cache' });
        const data = await result.json();
        console.log('data', data);
        setContributionData(data['contributions']);


        setTodaysContribution(data['contributions'][data['contributions'].length - 1].contributionCount === 0 ? 'No contribution today' : `You have ${data['contributions'][data['contributions'].length - 1].contributionCount} contributions today`)


        setTodaysContributionMsg(contributingMessage(data['contributions'][data['contributions'].length - 1].contributionCount))


        setTotalContributions(`Total contributions from year: ${data['totalContributions']}`)


    } catch (error) {
        console.error('Error fetching contributions:', error);
    }
};

export { gitContribution };


// {"color":"#ebedf0","contributionCount":0,"contributionLevel":"NONE","date":"2023-12-20"},