console.log("this is signup js page")
const form=document.getElementById("form")
form.addEventListener("submit",async(e)=>{
    try{
    e.preventDefault()
    const signupDetails={
    name :e.target.username.value,
    email:e.target.email.value,
    password:e.target.password.value,
    adminEmail : e.target.adminemail.value
    }
    const response=await axios.post(`http://localhost:2000/user/signup`,signupDetails)
    if(response.status==201)
    {
        window.location.href="./login"
        alert("Successfully signup")
    }
    else
    {
        throw new Error("Failed to login")
    }
}catch(err)
{
    console.log("err in signup",err)
    alert("user already exists Please login")
    document.body.innerHTML +=`<div style="color:red">${err} </div>`
}   

})