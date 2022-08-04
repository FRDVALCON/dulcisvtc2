window.onload = async () => {
    updateMembersTable();
    updateMemberCount();
    updateJobCount();
    updateNews();
};

async function updateMembersTable() {
    let { members } = (await (await fetch("https://api.dulcisvtc.com/vtc/members")).json()).response;
    const membersTable = document.getElementById("membersTable").getElementsByTagName('tbody')[0];

    members = members.sort((a, b) => {
        if (a.role === "Founder") {
            return -1;
        } else if (b.role === "Founder") {
            return 1;
        } else if (a.role === "Co-Founder") {
            return -1;
        } else if (b.role === "Co-Founder") {
            return 1;
        } else if (a.role === "General Manager") {
            return -1;
        } else if (b.role === "General Manager") {
            return 1;
        } else if (a.role === "Human Resources (EM)") {
            return -1;
        } else if (b.role === "Human Resources (EM)") {
            return 1;
        } else if (a.role === "Human Resources") {
            return -1;
        } else if (b.role === "Human Resources") {
            return 1;
        } else if (a.role === "Event Manager") {
            return -1;
        } else if (b.role === "Event Manager") {
            return 1;
        } else if (a.role === "Developer") {
            return -1;
        } else if (b.role === "Developer") {
            return 1;
        } else if (a.role === "Event Team") {
            return -1;
        } else if (b.role === "Event Team") {
            return 1;
        } else if (a.role === "Media Team") {
            return -1;
        } else if (b.role === "Media Team") {
            return 1;
        } else if (a.role === "Dulcis Driver") {
            return -1;
        } else if (b.role === "Dulcis Driver") {
            return 1;
        } else {
            return 0;
        };
    });

    for (const member of members) {
        const row = membersTable.insertRow();
        const usernameCell = row.insertCell();
        const roleCell = row.insertCell();
        usernameCell.innerHTML = member.username;
        roleCell.innerHTML = member.role;
    };
};

async function updateMemberCount() {
    const { members_count } = (await (await fetch("https://api.dulcisvtc.com/vtc/members")).json()).response;
    document.getElementById("tuser").innerHTML = members_count;
};

async function updateJobCount() {
    document.getElementById("tjobs").innerHTML = (await (await fetch("https://api.dulcisvtc.com/jobs")).json()).length;

    const reduced = (await (await fetch("https://api.dulcisvtc.com/jobs")).json()).reduce((acc, job) => acc + job.driven_distance, 0);
    document.getElementById("tdist").innerHTML = Math.round(reduced);
};

async function updateNews() {
    const response = await fetch("https://api.dulcisvtc.com/vtc/news");
    const { response: { news } } = await response.json();

    const newsHTML = news.map(({ id, title, content_summary, published_at, author, author_id }) => `
        <div class="article">
            <a href="https://truckersmp.com/vtc/55939/news/${id}" target="_blank"><h3>${title}</h3></a>
            <hr class="nhr">
            <p><b>${content_summary}</b></p>
            <p> Published By <username><a href="https://truckersmp.com/user/${author_id}" target="_blank">${author}</a></username> at ${published_at}</p>
        </div>
    `).join("");

    document.getElementById("npost").innerHTML = newsHTML;
};