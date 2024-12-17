function updateCountdown() {
  const endOfYear = new Date(
    `December 31, ${new Date().getFullYear()} 23:59:59`
  ).getTime();
  const now = new Date().getTime();
  const timeLeft = endOfYear - now;

  // Calculate time components
  const months = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)) % 30;
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  const miliSeconds = Math.floor((timeLeft % 1000) / 10); // Correct calculation

  console.log(months);


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
      ${months <= 0 ? '\n NO MONTHS R LEFT' : ''
    }
      `
  // Update the countdown every 10ms for smooth display
  setTimeout(updateCountdown, 100);
}

const gitContribution = async () => {
  try {
    // Fetch contributions data
    const result = await fetch('https://github-contributions-api.deno.dev/codershubinc.json?flat=true');
    const data = await result.json();

    const gridContainer = document.querySelector('.grid-background'); // Grid container

    // Generate grid items
    data['contributions'].forEach((item) => {
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item');
      gridItem.style.backgroundColor = item.color || '#ebedf0'; // Set color or default 
      

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

document.addEventListener("DOMContentLoaded", updateCountdown);

// {"color":"#ebedf0","contributionCount":0,"contributionLevel":"NONE","date":"2023-12-20"},