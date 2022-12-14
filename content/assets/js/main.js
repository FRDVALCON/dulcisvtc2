fetch("//api.dulcisvtc.com/vtc/members").then((res) => res.json()).then(({ response: { members } }) => {
    document.getElementById("tuser").innerHTML = members.length;
});

fetch("//api.dulcisvtc.com/jobs").then((res) => res.json()).then((jobs) => {
    document.getElementById("tjobs").innerHTML = jobs.length.toLocaleString();
    document.getElementById("tdist").innerHTML = `${Math.round(jobs.reduce((acc, job) => acc + job.driven_distance, 0)).toLocaleString()}km`;
    document.getElementById("tfuel").innerHTML = `${Math.round(jobs.reduce((acc, job) => acc + job.fuel_used, 0)).toLocaleString()}L`;
});

fetch("//api.dulcisvtc.com/vtc/news").then((res) => res.json()).then(({ response: { news } }) => {
    document.getElementById("npost").innerHTML = news.sort((a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    ).map(({ id, title, content_summary, published_at, author, author_id }) => `
        <div class="article">
            <a href="https://truckersmp.com/vtc/55939/news/${id}" target="_blank"><h3>${title}</h3></a>
            <hr class="nhr">
            <p><b>${content_summary}</b></p>
            <p>Published By <username><a href="https://truckersmp.com/user/${author_id}" target="_blank">${author}</a></username> at ${published_at}</p>
        </div>
    `).join("");
});

fetch("//api.dulcisvtc.com/users").then((res) => res.json()).then((data) => {
    document.getElementById("mdist").innerHTML = `${Math.round(data.reduce((acc, data) => acc + data.leaderboard.monthly_mileage, 0)).toLocaleString()}km`;
});

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
};