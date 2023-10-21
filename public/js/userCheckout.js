const bookingBtn = document.querySelector(".booking-btn");
const stripe = Stripe(
  "pk_test_51NpapKF999ms2lZr70xHHXs65pymKMWOulzCi6NKsGvMWqc6Y1fuTgzsO6PRreTV1dt6KYvUo53XnpLyyL46PE2200ohPfhNsF"
);
let tourId;
bookingBtn.addEventListener("click", (e) => {
  tourId = e.target.dataset.tourid;
  console.log(tourId);
});

const checkReq = async (tourId) => {
  try {
    const session = await axios(
      `http://localhost:8000/booking-checkout/${tourId}`
    );
    console.log(session);
    await session.rediretToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
  }
};
