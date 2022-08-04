window.onload = async () => {
    updateMembersTable();
};

async function updateMembersTable() {
    let { members } = (await (await fetch("https://api.dulcisvtc.com/vtc/members")).json()).response;
    const membersTable = document.getElementById("ulist").getElementsByTagName('tbody')[0];

    members = members.sort((a, b) => {
        if (a.role === "Founder") {
            return -1;
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
        roleCell.innerHTML = member.steam_id;
    };
};
