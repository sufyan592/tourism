export const alert = () => {
  const markup = `<section class="data-msg">
    <div class="data-msg-wrapper">
        <h1>Login Successfully</h1>
    </div>
</section>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
};
