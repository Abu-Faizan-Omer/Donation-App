console.log("charity approve");



const button = document.getElementById("getcharity");
const filterForm = document.getElementById("filterForm");
const div = document.getElementById("div");


// Fetch all approved charities
button.addEventListener("click", async () => {
    try {
        const response = await axios.get(`http://localhost:2000/charity/getcharity`);
        if (response.status === 200) {
            console.log("response.data.allcharities ",response.data.allcharities)
            
            displayCharities(response.data.allcharities);
        }
    } catch (err) {
        console.log("Error in fetching Approved charity:", err);
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
});



filterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const location = document.getElementById("locationid").value;
    const category = document.getElementById("categoryid").value;

    const searchParams = new URLSearchParams();//take url
    console.log("searchParams=== ",searchParams)

    if (location) searchParams.append("location", location);
    if (category) searchParams.append("category", category);

    const queryString = searchParams.toString();
    console.log("queryString>> ",queryString)
    const newUrl = queryString ? `?${queryString}` : "";

    // Update URL dynamically without reload
    window.history.pushState({}, "", newUrl);//URL ko update karta hai bina page reload kiye.

    try {
        console.log("Requesting charities with location:", location, "and category:", category);

        const response = await axios.get(`http://localhost:2000/charity/filter${newUrl}`);

        if (response.status === 200) {
            //localStorage.setItem("searchFilter", JSON.stringify({ location, category }));
            displayCharities(response.data.charities);
        }
    } catch (err) {
        console.log("Error in filtering charities:", err);
        document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
    }
});

// Load filters from URL if page is refreshed or opened in a new tab
window.addEventListener("DOMContentLoaded", async () => {
    const queryString = window.location.search;
    if (queryString) {
        try {
            const response = await axios.get(`http://localhost:2000/charity/filter${queryString}`);
            if (response.status === 200) {
                displayCharities(response.data.charities);
            }
        } catch (err) {
            console.log("Error loading charities from URL:", err);
        }
    }
});


// Function to display charities
function displayCharities(charities) {
    div.innerHTML = ""; // Clear previous content

    if (charities.length === 0) {
        div.innerHTML = `<p>No charities found.</p>`;
        return;
    }

    charities.forEach((charity) => {
        const charityDiv = document.createElement("div");
        charityDiv.innerHTML = `
            <p>Name: ${charity.name}</p>
            <p>Email: ${charity.email}</p>
            <p>Mission: ${charity.mission}</p>
            <p>Category: ${charity.category}</p>
            <p>Location: ${charity.location}</p>
            <p>Total Amount: ${charity.totalAmount}</p>
            <p>Donation Goal: ${charity.donationGoal}</p>
            <button onclick="openDonationPage(${charity.id})">Donate</button>
            <hr>
        `;
        div.appendChild(charityDiv);
    });
}

// Function to open the donation page for a specific charity
function openDonationPage(charityId) {
    window.location.href = `./donation?charityId=${charityId}`;
}

