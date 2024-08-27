import UploadComponent from "./components/UploadComponent";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import About from './pages/About';
import React, { FC } from "react";


const App: FC = () => {
  
  return (
    <Router>
         <Header />
         <Routes>
           <Route path="/" element={<UploadComponent/>} />
           <Route path="/about" element={<About/>} />
           {/* Define other routes here */}
         </Routes>
    </Router>
  );
}

export default App;
