import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { NearApp } from "./NearApp";
import { TableApp } from "./TableApp";
import { CarryApp } from "./CarryApp";
import "./styles.css";

export const pageForPath = (pathname: string) => pathname.startsWith("/carry")
  ? CarryApp
  : pathname.startsWith("/table")
    ? TableApp
    : pathname.startsWith("/near")
      ? NearApp
      : App;

const Page = pageForPath(window.location.pathname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
