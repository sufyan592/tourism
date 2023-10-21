const userbtn = document.querySelector(".user-save-btn");

const alert = (res) => {
  const markup = `<section class="data-msg">
        <div class="data-msg-wrapper">
            <h2>${res}</h2>
        </div>
    </section>`;
  document
    .querySelector(".user-account")
    .insertAdjacentHTML("beforebegin", markup);
};

const userData = async function (data, type) {
  try {
    const res = await axios({
      method: "PATCH",
      url:
        type === "password"
          ? "http://localhost:8000/api/v1/user/updateMyPassword"
          : "http://localhost:8000/api/v1/user/updateMe",
      data: data,
    });
    if (res.data.status === "Success") {
      alert(`${type} res.data.status`);
    } else {
      alert(res.data.status);
    }
  } catch (error) {
    alert(error);
  }
};

userbtn.addEventListener("click", () => {
  const form = new FormData();
  form.append("username", document.querySelector(".username").value);
  form.append("useremail", document.querySelector(".useremail").value);
  form.append("imageUpdate", document.querySelector(".image-update").files[0]);

  userData(form, "Data");

  setTimeout(() => {
    const alerthide = document.querySelector(".data-msg");
    if (alerthide) alerthide.remove();
  }, 1500);
});

// =================== Update Password ======================
const passChangebtn = document.querySelector(".pass-change");

passChangebtn.addEventListener("click", () => {
  const currentPass = document.querySelector(".cpassword").value;
  const newPass = document.querySelector(".npassword").value;
  const confirmPass = document.querySelector(".cnpassword").value;
  userData({ currentPass, newPass, confirmPass }, "password");
  setTimeout(() => {
    const alerthide = document.querySelector(".data-msg");
    if (alerthide) alerthide.remove();
  }, 1500);
});

// ================== Password Change ==================

// const currentPass = document.querySelector(".cpassword");
// const newPass = document.querySelector(".npassword");
// const confirmPass = document.querySelector(".cnpassword");
// const passChangebtn = document.querySelector(".pass-change");
