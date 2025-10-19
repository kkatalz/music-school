import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { Teachers } from "./teachers/Teachers";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/teachers" element={<Teachers />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
