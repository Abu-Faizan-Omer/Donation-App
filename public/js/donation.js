const urlParams = new URLSearchParams(window.location.search);
const charityId = urlParams.get("charityId"); // Correctly extract charityId
console.log('CharityId:', charityId);

let razorpayKey = ""; // Razorpay key_id will be stored here

// Fetch Razorpay key from backend
const fetchRazorpayKey = async () => {
    try {
        const response = await axios.get("http://localhost:2000/donation/get-key");
        razorpayKey = response.data.key;
    } catch (error) {
        console.error("Error fetching Razorpay key:", error);
        alert("There was an error initializing payment.");
    }
};

// Call the function to fetch Razorpay key
fetchRazorpayKey();

// Handle Donation Form Submission 1
const donationForm = document.getElementById("donationForm");
donationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const donationAmount = document.getElementById("donationAmount").value;

    // Validate if the donation amount is within the goal
    try {
        console.log("charityId ",charityId)
        const response = await axios.get(`http://localhost:2000/charity/${charityId}`);
        const charity = response.data.message;
        console.log("responsedata",response.data)
        console.log("charity ",charity)

        if (parseInt(donationAmount) + parseInt(charity.totalAmount) > charity.donationGoal) {
            alert("Donation exceeds the goal limit!");
            return;
        }

        // Create Razorpay Order
        const orderResponse = await axios.post("http://localhost:2000/donation/create-order", {
            amount: donationAmount,
        });

        const order = orderResponse.data.order;

        // Razorpay Payment Options
        const options = {
            key: razorpayKey, // Use the fetched Razorpay key
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "Charity Donation",
            description: "Donation for Charity",
            order_id: order.id,
            handler: async function (response) {
                // Payment Success
                alert("Payment successful! Thank you for your donation.");

                // Update charity total amount in the backend
                const updateResponse = await axios.patch(`http://localhost:2000/charity/donate/${charityId}`, {
                    donationAmount: donationAmount,
                });

                if (updateResponse.status === 200) {
                    const token=localStorage.getItem('token')
                    const decodeToken=parseJwt(token) //decoded token to knowits Premium useror Not
                    console.log('decodeToken>>>>',decodeToken)
                    console.log("token in save-donation",token)
                    
                    // Save donation record in the database
                    const donationResponse = await axios.post("http://localhost:2000/donation/save-donation",{
                        donationAmount: donationAmount,
                        paymentId: response.razorpay_payment_id, // Razorpay payment ID
                        status: "success", // Payment status

                        userId: decodeToken.userId, // Replace with actual user ID (e.g., from session or token)
                        charityId: charityId, // Charity ID
                    },{
                        headers: { 'Authorization': token }
                         });

                    if (donationResponse.status === 200) {
                        alert("Donation recorded successfully!");
                        window.location.href = "./home"; // Redirect to home page
                    }
                }
            }
        };

        // Open Razorpay Payment Modal
        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Error processing donation:", error);
        alert("There was an error processing your donation.");
    }
});
//this is downloaded how to decode jwt token frontend for to check it is premium user or not
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
