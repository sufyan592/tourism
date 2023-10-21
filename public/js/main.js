const alert = (res) => {
  const markup = `<section class="data-msg">
      <div class="data-msg-wrapper">
          <h2>${res}</h2>
      </div>
  </section>`;
  document.querySelector(".login").insertAdjacentHTML("afterbegin", markup);
};

const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:8000/api/v1/user/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "Success") {
      //   alert("Logged in Successfully.");
      //   console.log("Login Successfully");
      alert(res.data.status);
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      alert(res.data.status);
    }
  } catch (error) {
    alert(error.response.data.status);
  }
};

document.querySelector(".login-btn").addEventListener("click", (e) => {
  e.preventDefault();
  //   console.log(email.value, password.value);
  const email = document.querySelector(".useremail").value;
  const password = document.querySelector(".userpass").value;
  login(email, password);
});
