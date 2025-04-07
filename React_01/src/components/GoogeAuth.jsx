import React, { useEffect } from "react";

function GoogleAuth() {
  useEffect(() => {
    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id:
        "739178866783-qsnt4ijci9t9t96gpr21ofur00an7257.apps.googleusercontent.com", // Replace with your actual client ID
      callback: handleCredentialResponse,
    });

    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Google Token: ", response.credential);

    fetch("http://localhost:8080/api/v1/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server Response: ", data);
        // Optional: Redirect or set user state here
      });
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div id="google-signin"></div>
    </div>
  );
}

export default GoogleAuth;
