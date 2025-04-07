import React, { useState } from "react";

function App() {
  const [amount, setAmount] = useState(500);

  const API_URL = "http://localhost:8080";
  const RAZORPAY_KEY_ID = "rzp_test_UTrO295ehEpqLb"; // Replace with your actual key

  const handleRazorpayPayment = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      console.log("Order Data:", data);

      if (!data || !data.id) {
        console.error("Invalid Order Data:", data);
        return;
      }

      handlePaymentVerify(data);
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  const handlePaymentVerify = (data) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Test Payment",
      description: "Testing verify",
      order_id: data.id,
      handler: async function (response) {
        console.log("Payment Response:", response);

        try {
          const res = await fetch(`${API_URL}/api/v1/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verify = await res.json();
          console.log("Verification Response:", verify);
          alert(verify.message);
        } catch (error) {
          console.error("Payment verification failed:", error);
        }
      },
      prefill: {
        name: "Amit",
        email: "amit@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="border h-[20rem] w-[20rem] rounded-md">
        <img
          src="https://plus.unsplash.com/premium_photo-1740997621838-faaec5fa62d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNnx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury Car"
          className="h-full w-full"
        />
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={handleRazorpayPayment}
            className="bg-blue-500 px-4 py-2 rounded-sm text-white"
            type="button"
          >
            PAY WITH RAZORPAY
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
