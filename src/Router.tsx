import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AllPage } from "./routes/AllPages";
import { Page } from "./routes/Page";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<AllPage />} />
          <Route path="page/:id" element={<Page />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
