import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AllPage } from "./routes/AllPages";
import { Page } from "./routes/Page";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllPage />} />
        <Route path="/page/:id" element={<Page />} />
      </Routes>
    </BrowserRouter>
  );
}
