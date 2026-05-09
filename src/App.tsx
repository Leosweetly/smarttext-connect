import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Services from "@/components/landing/Services";
import Process from "@/components/landing/Process";
import Niches from "@/components/landing/Niches";
import Results from "@/components/landing/Results";
import FAQ from "@/components/landing/FAQ";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

const queryClient = new QueryClient();

const Landing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Hero />
      <Services />
      <Process />
      <Niches />
      <Results />
      <FAQ />
      <CtaSection />
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary">404</h1>
              <p className="text-muted-foreground mt-2">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
