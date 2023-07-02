const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const stripe = require("stripe")(functions.config().stripe.secret_key);
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.addUserStep = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      const userCustomClaims = user.customClaims;
      return admin.auth().setCustomUserClaims(user.uid, {
        ...userCustomClaims,
        step: data.step,
      });
    })
    .then(() => {
      return {
        message: "success",
      };
    })
    .catch((err) => {
      return err;
    });
});

exports.addUserMiscData = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      const userCustomClaims = user.customClaims;
      return admin
        .auth()
        .setCustomUserClaims(user.uid, { ...userCustomClaims, ...data });
    })
    .then(() => {
      return {
        message: "success",
      };
    })
    .catch((err) => {
      return err;
    });
});

// exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     success_url: "",
//     cancel_url: "",
//     line_items: [
//       {
//         quantity: 1,
//         price_data: {
//           currency: "usd",
//           unit_amount: 20 * 100,
//         },
//         product_data: {
//           name: "New Subscription",
//         },
//       },
//     ],
//   });
//   return session.id;
// });

// exports.stripeCharge = functions.database
//   .ref("/payments/{userId}/{paymentId}")
//   .onWrite((event) => {
//     const payment = event.data.val();
//     const userId = event.params.userId;
//     const paymentId = event.params.paymentId;

//     if (!payment || payment.charge) return;

//     return admin
//       .database()
//       .ref(`/users/${userId}`)
//       .once("value")
//       .then((snapshot) => {
//         return snapshot.val();
//       })
//       .then((customer) => {
//         const amount = payment.amount();
//         const idempotency_key = paymentId;
//         const source = payment.token.id;
//         const currency = "usd";
//         const charge = { amount, currency, source };
//         return stripe.charges.create(charge, { idempotency_key });
//       })
//       .then((charge) => {
//         admin
//           .database()
//           .ref(`/payments/${userId}/${paymentId}/charge`)
//           .set(charge);
//       });
//   });

exports.getSubscriptionDetails = functions.https.onCall(
  async (data, context) => {
    let customerId = data.customerId;

    let subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    return subscriptions;
  }
);

exports.cancelSubscription = functions.https.onCall(async (data, context) => {
  let subscriptionId = data.subscriptionId;

  let subscriptionDeleted = await stripe.subscriptions.del(subscriptionId);

  return subscriptionDeleted;
});

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  // Getting data from client
  let customerId = data.customerId;
  //   let name = data.name;
  let price = data.price;
  let quantity = data.quantity;
  // Simple validation
  if (!price || !customerId || !quantity)
    return { message: "All fields are required" };
  //   price = parseInt(price);
  // Initiate payment

  //   try {
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: Math.round(amount * 100),
  //   currency: "USD",
  //   payment_method_types: ["card"],
  //   metadata: { name },
  //   receipt_email: "abbascarmody@gmail.com",
  // });

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: "2018-11-08" }
  );

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price,
        quantity,
      },
    ],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  if (
    !subscription.latest_invoice ||
    typeof subscription.latest_invoice === "string"
  ) {
    return {
      message:
        "Subscription was created without an invoice. Please contact support.",
    };
  }

  if (
    !subscription.latest_invoice.payment_intent ||
    typeof subscription.latest_invoice.payment_intent === "string"
  ) {
    return {
      message:
        "Subscription was created without a payment intent. Please contact support.",
    };
  }

  return {
    paymentIntent: subscription.latest_invoice.payment_intent.client_secret,
    ephemeralKey: ephemeralKey.secret,
  };

  // Extracting the client secret
  // const clientSecret = paymentIntent.client_secret;
  // Sending the client secret as response
  // return { message: "Payment initiated", clientSecret };
  //   } catch (err) {
  //     // Catch any error and send error 500 to client
  //     // const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
  //     //   err.raw.payment_intent.id
  //     // );
  //     return err;
  //   }
});

exports.createCustomer = functions.https.onCall(async (data, context) => {
  const customer = await stripe.customers.create({
    description: data.customerEmail,
    email: data.customerEmail,
  });

  return customer;
});
