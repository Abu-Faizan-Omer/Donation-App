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

// Filter charities based on location and category
filterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const location = document.getElementById("locationid").value;
    const category = document.getElementById("categoryid").value;

    const search={
        location:location,
        category:category
    }

    try {
        console.log("Requesting charities with location:", location, "and category:", category);

        const response = await axios.get(`http://localhost:2000/charity/filter`, {
            params: { location, category },
        });

        if (response.status === 200) {
            localStorage.setItem("searchFilter",JSON.stringify(search))
            displayCharities(response.data.charities);
        }
    } catch (err) {
        console.log("Error in filtering charities:", err);
        if (err.response && err.response.status === 404) {
            div.innerHTML = `<p>No charities found for the given criteria.</p>`;
        } else {
            document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
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

window.addEventListener("DOMContentLoaded",async()=>{
    const searchFilter = JSON.parse(localStorage.getItem("searchFilter"));

    if (searchFilter) {
        
        const { location, category } = searchFilter;

        document.getElementById("locationid").value=searchFilter.location
        document.getElementById("categoryid").value=searchFilter.category
        
        try {
            const response = await axios.get(`http://localhost:2000/charity/filter`, {
                params: { location, category }
            });

            if (response.status === 200) {
                displayCharities(response.data.charities);
            }
        } catch (err) {
            console.log("Error in fetching filtered charities on page load:", err);
            if (err.response && err.response.status === 404) {
                div.innerHTML = `<p>No charities found for the saved criteria.</p>`;
            } else {
                document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
            }
        }
    }
});