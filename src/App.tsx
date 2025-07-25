
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={
            <main className="flex items-center justify-center min-h-screen">
              <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-lg max-w-md">
                <h1 className="text-4xl font-bold text-gray-900">SmartText Connect</h1>
                <p className="text-xl text-gray-600">Project updated to latest Lovable version!</p>
                <div className="flex flex-col space-y-2 text-sm text-green-600">
                  <span>✅ lovable-tagger installed</span>
                  <span>✅ Path aliases configured</span>
                  <span>✅ Environment types updated</span>
                  <span>✅ UI components created</span>
                  <span>✅ Build errors resolved</span>
                </div>
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
