import UploadComponent from "./components/UploadComponent";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Overview from './pages/Overview';
import { FC, useState } from "react";
import HowItWorks from "./pages/HowItWorks";
import AboutTheDev from "./pages/AboutTheDev";
import './styles/App.css';


const App: FC = () => {
  const [showHeader, setShowHeader] = useState(true);

  const handleValidFile = () => {
    setShowHeader(false);
  };

  const handleNoFile = () => {
    setShowHeader(true);
  };

  return (
    <Router>
        <div className="app-wrapper">
            {showHeader && <Header />}
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<UploadComponent onValidFile={handleValidFile} onNoFile={handleNoFile}/>} />
                    <Route path="/overview" element={<Overview/>} />
                    <Route path="/how-it-works" element={<HowItWorks/>} />
                    <Route path="/about" element={<AboutTheDev/>} />
                </Routes>
            </div>
        </div>
    </Router>
  );
}

export default App;
