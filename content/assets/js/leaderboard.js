fetch("https://api.dulcisvtc.com/users").then((res) => res.json()).then((data) => {
    const leaderboardDiv = document.getElementById("leaderboard");
    data = data
        .sort((a, b) => b.leaderboard.monthly_mileage - a.leaderboard.monthly_mileage)
        .filter((member) => member.leaderboard.monthly_mileage > 1);

    // create a div element with class "luser" for each of the data items
    const users = data.map((user, i) => `
        <div class="luser">
            <p><strong>${formatPosition(i + 1)}</strong></p>
            <p>${user.username}</p>
            <p>${Math.round(user.leaderboard.monthly_mileage)} km</p>
        </div>
    `).join("");

    leaderboardDiv.innerHTML = users;

    function formatPosition(i) {
        if (i === 1) {
            return "1st";
        } else if (i === 2) {
            return "2nd";
        } else if (i === 3) {
            return "3rd";
        } else {
            return `${i}th`;
        };
    };
});