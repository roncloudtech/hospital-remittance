// src/components/PaystackButton.js
import { useEffect } from "react";

const PaystackButton = ({amt, hospital, email, ref}) => {
  useEffect(() => {
    // Load the Paystack script only once
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  console.log(amt, hospital, email);

  const payWithPaystack = () => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_baecdbe89b4c293f6a4564d49843b1fcd8c937f9", // 🔐 Replace with your real public key
      email: email,
      amount: amt * 100, // Amount is in **kobo** (so 500000 = ₦5,000)
      currency: "NGN",
      ref: ref,
      metadata: {
        custom_fields: [
          {
            display_name: hospital,
            variable_name: "phone_number",
            value: "+2348012345678",
          },
        ],
      },
      callback: function (response) {
        // Handle response here
        console.log("Payment complete!", response);
        alert("Payment complete! Reference: " + response.reference);
      },
      onClose: function () {
        console.log("Payment closed");
        alert("Payment window closed.");
      },
    });

    handler.openIframe();
  };

  return (
    <button onClick={payWithPaystack} className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}>
      Pay with Paystack
    </button>
  );
};

export default PaystackButton;
