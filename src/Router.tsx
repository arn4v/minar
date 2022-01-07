import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AllPages } from "./routes/AllPages";
import { Page } from "./routes/Page";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllPages />} />
        <Route path="/page/:id" element={<Page />} />
      </Routes>
    </BrowserRouter>
  );
}
