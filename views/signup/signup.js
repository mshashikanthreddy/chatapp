async function signup(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;
    const signupDetails = {
      name,
      email,
      phone,
      password,
    };
    // console.log(signupDetails);
    try {
      const res = await axios.post(
        `http://34.236.150.186/user/signup`,
        signupDetails
      );
  
      if (res.data.alreadyexisting === false) {
        //if user not existed then only create new user
        // console.log("succesfully created new user");
        alert("User registered successfully");

        event.target.name.value = '';
        event.target.email.value = '';
        event.target.phone.value= '';
        event.target.password.value = '';
        (window.location.href="../login/login.html"); 

      } else {
        alert("Account credentials already exists");
        // throw new Error("failed to Signup , account is already exist");
      }
    } catch (err) {
      console.log(err);
      // document.body.innerHTML += `<div style="color:red;">${err}</div>`;
    }
  }