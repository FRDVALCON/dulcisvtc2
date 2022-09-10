fetch("//api.dulcisvtc.com/jobs").then((res) => res.json()).then(async (data) => {
    if (new URLSearchParams(window.location.search).get("err") === "nouser")
        return alert("Please log a job in order to link your account!");
    const user = await fetch("/user").then((res) => res.json());
    if (!user.steam_id) return alert("Please link your steam account!");

    const jobs = data.filter((x) => x.driver.steam_id === user.steam_id);
    const mjobs = jobs.filter((x) => new Date(x.stop_timestamp).getMonth() === new Date().getMonth());
    const damage = jobs.reduce((prev, x) => prev + x.cargo.damage, 0) * 100 / jobs.length;

    document.getElementById("ptjobs").innerHTML = jobs.length.toLocaleString();
    document.getElementById("pmjobs").innerHTML = mjobs.length.toLocaleString();

    document.getElementById("ptdist").innerHTML = `${Math.round(jobs.reduce((acc, job) => acc + job.driven_distance, 0)).toLocaleString()}km`;
    document.getElementById("pmdist").innerHTML = `${Math.round(mjobs.reduce((acc, job) => acc + job.driven_distance, 0)).toLocaleString()}km`
    document.getElementById("ptfuel").innerHTML = `${Math.round(jobs.reduce((acc, job) => acc + job.fuel_used, 0)).toLocaleString()}L`;
    document.getElementById("ptdamage").innerHTML = `${damage.toFixed(2)}%`

    const jobsTable = document.getElementById("pjobdata").getElementsByTagName('tbody')[0];
    jobs.reverse().map((itemData) => {
        const row = jobsTable.insertRow();

        const sourceCity = row.insertCell();
        const destinationCity = row.insertCell();
        const drivenDistance = row.insertCell();
        const fuelUsed = row.insertCell();
        const damage = row.insertCell();

        sourceCity.innerHTML = itemData.source_city;
        destinationCity.innerHTML = itemData.destination_city;
        drivenDistance.innerHTML = `${Math.round(itemData.driven_distance).toLocaleString()}km`;
        fuelUsed.innerHTML = `${Math.round(itemData.fuel_used).toLocaleString()}L`
        damage.innerHTML = `${Math.round(itemData.cargo.damage * 100).toLocaleString()}%`;
    });
});