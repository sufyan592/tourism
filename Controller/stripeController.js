const { tour } = require("./viewController");
const Tour = require("../model/tourSchema");

const stripe = require("stripe")(
  "sk_test_51NpapKF999ms2lZrj6MVffJ3susxO1XjBynt2L4WOt19zDO7ce63pOCkDT1BMF8YP86kaZNIhxEj2AQkXeGDSyL800SW3HQUAe"
);
exports.stripeCheckout = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.tourId);
    console.log(tour);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/`,
      cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: `${tour.name} Tour`,
              description: `${tour.description}`,
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
    });
    res.status(200).json({
      session,
    });
    next();
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
