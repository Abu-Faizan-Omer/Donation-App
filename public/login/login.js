const form=document.getElementById("form")
form.addEventListener("submit",async(event)=>{
    try{

         event.preventDefault()
         const loginDetails={
             email:event.target.email.value,
             password:event.target.password.value,
             adminEmail:event.target.adminemail.value
         }
         console.log("loginDetails",loginDetails)    
        const response=await axios.post(`http://localhost:2000/user/login`,loginDetails)
        if(response.status==200)
     {
        alert(response.data.message)
        localStorage.setItem("token",response.data.token)
        console.log("response.data.token",response.data.token)
        if (response.data.isAdmin) {
            window.location.href = "../admin/admin.html"
        } else {
            window.location.href = "../charity/charity.html"
        }
    }
}catch(err)
{
    console.log('err in login',err)
    document.body.innerHTML += `<div style="color:red;">${err.response ? err.response.data.message : 'Login failed'}</div>`;

} 
})