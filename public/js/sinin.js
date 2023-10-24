const alert = (res) => {
  const markup = `<section class="data-msg">
        <div class="data-msg-wrapper">
            <h2>${res}</h2>
        </div>
    </section>`;
  document.querySelector(".login").insertAdjacentHTML("afterbegin", markup);
};

// ================ Signin =====================

const signin = async (name, email, password, Cpassword, photo) => {
  try {
    const res = await axios({
      method: "POST",
      // url: "http://localhost:8000/api/v1/user/signin",
      url: "/api/v1/user/signin",
      data: {
        name,
        email,
        password,
        Cpassword,
      },
    });
    if (res.data.status === "Success") {
      //   alert("Logged in Successfully.");
      //   console.log("Login Successfully");
      alert(res.data.status);
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    } else {
      alert(res.data.status);
    }
  } catch (error) {
    alert(error.response.data.status);
  }
};

document.querySelector(".signin-btn").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Running");
  //   console.log(email.value, password.value);
  const name = document.querySelector(".username").value;
  const email = document.querySelector(".useremail").value;
  const password = document.querySelector(".userpass").value;
  const Cpassword = document.querySelector(".userCpass").value;
  // const photo = document.querySelector(".userpass").value;
  console.log(name, email, password, Cpassword);

  signin(name, email, password, Cpassword);
});
