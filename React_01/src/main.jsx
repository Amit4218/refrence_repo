import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import Userform from "./components/Userform";
// import GoogeAuth from "./components/GoogeAuth";
import { APIProvider } from "@vis.gl/react-google-maps";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Userform /> */}
    {/* <GoogeAuth /> */}
    <APIProvider>
      <Map />
    </APIProvider>
  </StrictMode>
);
