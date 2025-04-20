import { useEffect } from "react";
const PaystackButton = ({ amt, hospital, email, onSuccess, onClose, refCode }) => {

    useEffect(() => {
    // Load the Paystack script only once
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const payWithPaystack = () => {
    // const ref = `PAYSTACK-${Date.now()}`;
    const handler = window.PaystackPop.setup({
      key: "pk_test_baecdbe89b4c293f6a4564d49843b1fcd8c937f9",
      email: email,
      amount: amt * 100,
      currency: "NGN",
      ref: refCode, //ref,
      // ref: refCode, //ref,
      metadata: {
        hospital_id: hospital
      },
      callback: (response) => {
        onSuccess(response); // Pass full response to parent
      },
      onClose: () => {
        onClose();
        alert("Payment window closed.");
      }
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={payWithPaystack}
      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
    >
      Pay with Paystack
    </button>
  );
};

export default PaystackButton;
