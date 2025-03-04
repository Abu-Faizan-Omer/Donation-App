console.log("Hi Admin");

        const button = document.getElementById("getall");
        const unapproveDiv = document.getElementById("unapprove");

        button.addEventListener("click", async () => {
            try {
                const token=localStorage.getItem("token")
                console.log("token ",token)
                const response = await axios.get("http://localhost:2000/charity/unapprove",{
                headers: { 'Authorization': token }
                 });
                console.log("Response:", response.data);

                // Check if response is 403 (Not authorized)
                if (response.status === 403) {
                    alert("Only admins have access!");   
                  }

                if (response.status === 201) {
                    const charities = response.data.allCharity; // Assuming the response contains `allCharity`
                    unapproveDiv.innerHTML = ""; // Clear previous content

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
                            <button onclick="approveCharity(${charity.id})">Approve</button>
                            <button onclick="rejectCharity(${charity.id})">Reject</button>
                            <hr>
                        `;
                        unapproveDiv.appendChild(charityDiv);
                    });
                }
            } catch (err) {
                console.log("Error in fetching unapproved charity:", err);
                document.body.innerHTML += `<div style="color:red">${err.message}</div>`;
            }
        });

        // Function to approve a charity
        async function approveCharity(charityId) {
            try {
                const response = await axios.put(`http://localhost:2000/charity/approve/${charityId}`);
                if (response.status === 200) {
                    alert("Charity approved successfully!");
                    button.click(); // Refresh the list
                }
            } catch (err) {
                console.log("Error approving charity:", err);
                alert("Failed to approve charity.");
            }
        }

        // Function to reject a charity
        async function rejectCharity(charityId) {
            try {
                const response = await axios.delete(`http://localhost:2000/charity/reject/${charityId}`);
                if (response.status === 200) {
                    alert("Charity rejected successfully!");
                    button.click(); // Refresh the list
                }
            } catch (err) {
                console.log("Error rejecting charity:", err);
                alert("Failed to reject charity.");
            }
        }