import UploadComponent from "./components/UploadComponent";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Overview from './pages/Overview';
import React, { FC } from "react";
import HowItWorks from "./pages/HowItWorks";
import AboutTheDev from "./pages/AboutTheDev";


const App: FC = () => {
  
  return (
    <Router>
         <Header />
         <Routes>
           <Route path="/" element={<UploadComponent/>} />
           <Route path="/overview" element={<Overview/>} />
           <Route path="/how-it-works" element={<HowItWorks/>} />
           <Route path="/about" element={<AboutTheDev/>} />
           {/* Define other routes here */}
         </Routes>
    </Router>
  );
}

export default App;
