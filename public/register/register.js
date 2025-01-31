const form=document.getElementById("form")
form.addEventListener("submit",async(event)=>{
    event.preventDefault()
    const registerCharity={
        name:event.target.charity.value,
        email:event.target.email.value,
        mission:event.target.mission.value,
        amount:event.target.amount.value,
        goal:event.target.goal.value
    }
    console.log("registerCharity",registerCharity)
    const response=await axios.post(`http://localhost:2000/charity/register`,registerCharity)
    
})