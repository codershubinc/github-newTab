const contributingMessage = (cnt) => {
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



function updateCountdown() {
    const endOfYear = new Date(`December 31, ${new Date().getFullYear()} 23:59:59`);
    const now = new Date();
    const timeLeft = endOfYear - now;

    // Calculate the number of months left
    const months = endOfYear.getMonth() - now.getMonth() + (endOfYear.getFullYear() - now.getFullYear()) * 12;

    // Calculate the number of days left (without the months)
    const tempDate = new Date(now);
    tempDate.setMonth(tempDate.getMonth() + months);
    const days = Math.floor((endOfYear - tempDate) / (1000 * 60 * 60 * 24));

    // Calculate other components
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    const miliSeconds = Math.floor((timeLeft % 1000) / 10);

    // Display the countdown
    document.getElementById("countdown").innerHTML =
        `${months <= 0 ? '' :
            months
                .toString()
                .padStart(2, "0") + "m  : "}
    
    ${days
            .toString()
            .padStart(2, "0")}d 
    :
    ${hours
            .toString()
            .padStart(2, "0")}h 
        :
        ${minutes.toString().padStart(2, "0")}m :  
    ${seconds
            .toString()
            .padStart(2, "0")}s 
        :
    ${miliSeconds
            .toString()
            .padStart(2, "0")}ms`;


    document.getElementById("months-left").innerHTML = `
        ${days <= 0 ? '\nLess than a day left' : months <= 0 ? '\nLess than a month left' : ''
        }
        `
        // Update the countdown every 10ms for smooth display
    setTimeout(updateCountdown, 100);
}

const gitContribution = async() => {
    try {
        const todaysDate = new Date().getFullYear() + '-' +
            String(new Date().getMonth() + 1).padStart(2, '0') + '-' +
            String(new Date().getDate()).padStart(2, '0');
        console.log('todaysDate', todaysDate);
        console.log('Date of now = ', new Date().getDate() + '-' + Number(new Date().getMonth() + 1) + '-' + new Date().getFullYear());


        // Fetch contributions data
        const result = await fetch('https://github-contributions-api.deno.dev/codershubinc.json?flat=true&from=2024-03-01&to=' + todaysDate, { cache: 'no-cache' });
        const data = await result.json();
        console.log('data', data);

        const gridContainer = document.querySelector('.grid-background'); // Grid container
        gridContainer.innerHTML = '';
        document.getElementsByClassName('todaysContribution')[0].innerHTML = data['contributions'][data['contributions'].length - 1].contributionCount === 0 ? 'No contribution today' : `You have ${data['contributions'][data['contributions'].length - 1].contributionCount} contributions today`;
        document.getElementsByClassName('todaysContributionMsg')[0].innerHTML = contributingMessage(data['contributions'][data['contributions'].length - 1].contributionCount);
        document.getElementsByClassName('totalContributions')[0].innerHTML = `Total contributions from year: ${data['totalContributions']}`;
        // Generate grid items
        data['contributions'].forEach((item) => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.style.backgroundColor = item.color === '#ebedf0' ? '#232121' : item.color || '#ebedf0'; // Set color or default 


            // Create a tooltip to show contribution details
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = `${item.contributionCount} contributions in ${item.date} `; // Display the number of contributions


            // Append the tooltip to the grid item
            gridItem.appendChild(tooltip);

            // Append the grid item to the grid container
            gridContainer.appendChild(gridItem);
        });
    } catch (error) {
        console.error('Error fetching contributions:', error);
    }
};

gitContribution()

document.addEventListener("DOMContentLoaded", () => {
    updateCountdown();
    gitContribution();
});




// {"color":"#ebedf0","contributionCount":0,"contributionLevel":"NONE","date":"2023-12-20"},