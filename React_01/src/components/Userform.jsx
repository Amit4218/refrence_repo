import React, { useState } from "react";
import axios from "axios";

function Userform() {
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [signal, setsignal] = useState(true);

  const api_url = "http://localhost:8080";

  const handelSubmit = async (e) => {
    e.preventDefault();

    const otp = Math.floor(1000 + Math.random() * 9000);
    const templateParams = {
      name: email,
      email: email,
      otp: otp,
    };

    await axios.post(`${api_url}/api/v1/otp-save`, { otp });

    try {
      const res = await emailjs.send(
        "", // Replace with actual Service ID
        "", // Replace with actual Template ID
        templateParams,
        "" // Replace with actual Public Key
      );

      console.log("Email sent:", res);
      alert("OTP sent successfully to " + email);
      setsignal(false);
    } catch (error) {
      console.error("EmailJS error:", error);
      alert("Failed to send OTP");
    }

    setemail("");
    setphone("");

    setsignal(false);
  };

  const compare = async (e) => {
    e.preventDefault();

    const otp = document.getElementById("otp").value;
    const otpCompare = await axios.get(
      `${api_url}/api/v1/otp-compare?otp=${otp}`
    );

    if (otpCompare.status === 200) {
      alert("correct otp");
    }
  };

  return (
    <>
      {signal ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              User Verification
            </h2>
            <form action="#" onSubmit={handelSubmit}>
              <label className="block mb-4">
                <span className="text-gray-700">Email</span>
                <input
                  type="email"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Enter your email"
                  name="email"
                />
              </label>
              <label className="block mb-6">
                <span className="text-gray-700">Phone Number</span>
                <input
                  type="number"
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setphone(e.target.value)}
                  placeholder="Enter your phone number"
                  name="phone"
                />
              </label>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Enter Details
            </h2>
            <form onSubmit={compare}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="number"
                  className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="code"
                  name="otp"
                  id="otp"
                />
              </div>
              <button className="mt-3 px-4 py-2 border">Verify</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Userform;
