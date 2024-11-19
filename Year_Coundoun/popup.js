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

  // Display the countdown
  document.getElementById("countdown").innerHTML = `${months
    .toString()
    .padStart(2, "0")}m :  ${days.toString().padStart(2, "0")}d :   ${hours
    .toString()
    .padStart(2, "0")}h :   ${minutes.toString().padStart(2, "0")}m :   ${seconds
    .toString()
    .padStart(2, "0")}s :   ${miliSeconds.toString().padStart(2, "0")}ms`;

  // Update the countdown every 10ms for smooth display
  setTimeout(updateCountdown, 100);
}

document.addEventListener("DOMContentLoaded", updateCountdown);
