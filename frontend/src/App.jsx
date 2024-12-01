import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InvoiceList } from "./pages/InvoiceList";
import { InvoiceForm } from "./pages/InvoiceForm";
import {InvoiceView} from "./pages/InvoiceView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InvoiceList />} />
        <Route path="/invoice/new" element={<InvoiceForm />} />
        <Route path="/invoice/:id/edit" element={<InvoiceForm />} />
        <Route path="/invoice/:id" element={<InvoiceView />} />
      </Routes>
    </Router>
  );
}

export default App;
