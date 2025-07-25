
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={
            <main className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">SmartText Connect</h1>
                <p className="text-xl text-muted-foreground">Project updated to latest Lovable version</p>
              </div>
            </main>
          } />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-xl">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
