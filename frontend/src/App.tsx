import "./App.css";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logs from "./pages/Logs";
import Users from "./pages/Users";
import LidarSummary from "./pages/LidarSummary";
import ProtectedRoute from "./components/ProtectedRoute";
import useTelemetry from "./hooks/useTelemetry";

const App = () => {
  const {
    telemetry,
    isTelemetryConnected,
    telemetryError,
    isLoading: isTelemetryLoading,
  } = useTelemetry();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="text-white text-center font-medium !font-montserrat"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard
                  telemetry={telemetry}
                  isTelemetryConnected={isTelemetryConnected}
                  telemetryError={telemetryError}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <Logs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lidar"
            element={
              <ProtectedRoute>
                <LidarSummary
                  telemetry={telemetry}
                  isLoading={isTelemetryLoading}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
