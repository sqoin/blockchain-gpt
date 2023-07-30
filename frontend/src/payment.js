import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js"
import "./payment.css";
import { SERVICE_STRIPE_URL } from "./utils/constants";

function Payment(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  useEffect(() => {
    fetch(`${SERVICE_STRIPE_URL}/config`).then(async (r) => {
      const { publishableKey } = await r.json();


      setStripePromise(loadStripe(publishableKey));

    });
  }, []);
  useEffect(() => {
    fetch(`${SERVICE_STRIPE_URL}/create-payment-intent`, {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (r) => {
      const { clientSecret } = await r.json();
      setClientSecret(clientSecret);


    });
  }, []);






  console.log(stripePromise);
  console.log(clientSecret);

  return (
    <div className="payment">
      <h1>Stripe  Payment  </h1>
      {stripePromise && clientSecret && (

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>

      )}
    </div>
  );
}

export default Payment;
