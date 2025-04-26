import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/landingPage';
import DashBoard from './components/pages/dashboard';
import RoadmapInput from './components/roadmapForm';
import { AuthContextProvider } from './context/authContext';
import ProtectedRoute from './protectRoutes';
import Subscriptions from './components/pages/subscriptions';

function App() {
  return (
    <div className="font-sans">
      <AuthContextProvider>
        <Routes>
          <Route index element={<LandingPage />} />

          <Route
            path={'/dashboard'}
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route path={'/login'} element={<RoadmapInput />} />
          <Route path={'/subscription'} element={<Subscriptions />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
