const stripe = Stripe("pk_test_51S9or41hqh1au5WuVuxtRgqzNDoIgLJbaEMDrwaAHPLnrYvsfEUNOMEmTpPml6PgD61zbzjeXxCkGjTjrqSMV6g600UJ2UzEpO"); 

const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

const form = document.getElementById("payment-form");
const message = document.getElementById("payment-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: "card",
    card: cardElement,
  });

  if (error) {
    message.textContent = error.message;
    return;
  }

  const response = await fetch("http://localhost:4000/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: 5000, 
      currency: "usd",
      paymentMethodId: paymentMethod.id,
    }),
  });

  const result = await response.json();

  if (result.status === "succeeded") {
    message.textContent = "✅ Payment Successful!";
  } else {
    message.textContent = "⚠️ Payment Status: " + result.status;
  }
});
