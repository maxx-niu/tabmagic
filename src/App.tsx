import { FC, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import UploadComponent from "./components/UploadComponent";
import Header from "./components/Header";
import Overview from "./pages/Overview";
import TabVisualizer from "./components/visualizers/TabVisualizer";
import "./styles/App.css";

const AppContent: FC = () => {
  const [showHeader, setShowHeader] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setShowHeader(
      location.pathname === "/" ||
        location.pathname === "/overview"
    );
  }, [location.pathname]);

  const handleValidFile = () => {
    setShowHeader(false);
  };

  const handleNoFile = () => {
    setShowHeader(true);
  };

  return (
    <div className="app-wrapper">
      {showHeader && <Header />}
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <UploadComponent
                onValidFile={handleValidFile}
                onNoFile={handleNoFile}
              />
            }
          />
          <Route path="/overview" element={<Overview />} />
          <Route path="/visualizer" element={<TabVisualizer />} />
        </Routes>
      </div>
    </div>
  );
};

const App: FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
