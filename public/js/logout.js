const alert = (res) => {
  const markup = `<section class="data-msg">
        <div class="data-msg-wrapper">
            <h2>${res}</h2>
        </div>
    </section>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
};

// ======================== LogOut =================================

const logoutData = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/user/logout",
    });
    if (res.data.status === "success") {
      location.reload(true);
      // alert(res.data.status);
    }
  } catch (error) {
    alert(error);
  }
};

document.querySelector(".logout").addEventListener("click", async () => {
  logoutData();
});
