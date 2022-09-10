fetch("//api.dulcisvtc.com/users").then((res) => res.json()).then((data) => {
    const leaderboardDiv = document.getElementById("leaderboard");
    data = data
        .sort((a, b) => (b.leaderboard.alltime_mileage ?? 0) - (a.leaderboard.alltime_mileage ?? 0))
        .filter((member) => (member.leaderboard.alltime_mileage ?? 0) > 1);

    const users = data.map((user, i) => `
        <div class="luser">
            <p><strong>${formatPosition(i + 1)}</strong></p>
            <p>${user.username.match(/[-[\]{}()*+?.,\\^$|#\s\da-z]/gi).join("").trim()}</p>
            <p>${Math.round(user.leaderboard.alltime_mileage)} km</p>
        </div>
    `).join("");

    leaderboardDiv.innerHTML = users;
});

function formatPosition(i) {
    if (`${i}`.endsWith("1") && !`${i}`.endsWith("11")) {
        return `${i}st`;
    } else if (`${i}`.endsWith("2") && !`${i}`.endsWith("12")) {
        return `${i}nd`;
    } else if (`${i}`.endsWith("3") && !`${i}`.endsWith("13")) {
        return `${i}rd`;
    } else {
        return `${i}th`;
    };
};