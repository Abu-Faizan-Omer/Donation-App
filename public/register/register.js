const form=document.getElementById("form")
form.addEventListener("submit",async(event)=>{
    try{
    event.preventDefault()
    const registerCharity={
        name:event.target.charity.value,
        email:event.target.email.value,
        mission:event.target.mission.value,
        category: event.target.category.value, 
        location: event.target.location.value,
        totalAmount:event.target.amount.value,
        donationGoal: event.target.goal.value
    }
    console.log("registerCharity",registerCharity)
    const response=await axios.post(`http://localhost:2000/charity/register`,registerCharity)
    console.log("response",response)
    if (response.status==201)
    {
        alert("Charity register Successfully Register")
        form.reset()
    }
}catch(err){
    console.log("Not register",err)
    alert("Register Failed")
}

})