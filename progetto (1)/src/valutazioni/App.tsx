import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { Toaster } from "sonner";

function App() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-[#F5F0E8]">
        <div className="text-center">
          <p className="font-playfair text-2xl text-[#C8A96E]">2D Valuta Pro</p>
          <p className="text-sm text-[#5C5346] font-source mt-2">Caricamento...</p>
        </div>
      </div>
    }>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FDFAF4',
              border: '1px solid #D4C9B0',
              color: '#1A1A1A',
              fontFamily: "'Source Sans 3', sans-serif",
            },
          }}
        />
      </>
    </Suspense>
  );
}

export default App;
