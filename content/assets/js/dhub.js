fetch("https://api.dulcisvtc.com/jobs").then((res) => res.json()).then((data) => {
    const jobsTable = document.getElementById("jobdata").getElementsByTagName('tbody')[0];

    data.reverse().map((itemData) => {
        const row = jobsTable.insertRow();

        const username = row.insertCell();
        const sourceCity = row.insertCell();
        const sourceCompany = row.insertCell();
        const destinationCity = row.insertCell();
        const destinationCompany = row.insertCell();
        const cargo = row.insertCell();
        const drivenDistance = row.insertCell();
        const fuelUsed = row.insertCell();

        username.innerHTML = itemData.driver.username;
        sourceCity.innerHTML = itemData.source_city ?? "[unknown]";
        sourceCompany.innerHTML = itemData.source_company ?? "[unknown]";
        destinationCity.innerHTML = itemData.destination_city ?? "[unknown]";
        destinationCompany.innerHTML = itemData.destination_company ?? "[unknown]";
        cargo.innerHTML = itemData.cargo.name;
        drivenDistance.innerHTML = `${Math.round(itemData.driven_distance).toLocaleString()}km`;
        fuelUsed.innerHTML = `${Math.round(itemData.fuel_used).toLocaleString()}L`;
    });
});