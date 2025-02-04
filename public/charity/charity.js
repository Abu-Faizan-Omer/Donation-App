console.log("charity approve")
const button=document.getElementById("getcharity")
button.addEventListener("click",async()=>{
    try{
    const div=document.getElementById("div")
    const response=await axios.get(`http://localhost:2000/charity/getcharity`)
    if(response.status==200)
    {
        const charities = response.data.allcharities; // Assuming the response contains `allCharity`
                    div.innerHTML = ""; // Clear previous content

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
                    })
    }
}catch(err)
{
    console.log("Error in fetching Approved charity:", err);
    document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
}
})


// Function to open the donation page for a specific charity
function openDonationPage(charityId) {
    window.location.href = `../donation/donation.html?charityId=${charityId}`; // Redirect to donation page with charity ID
}