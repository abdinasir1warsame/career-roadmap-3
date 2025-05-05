import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import DashBoard from './pages/dashboard';
import RoadmapInput from './components/roadmapForm';
import { AuthContextProvider } from './context/authContext';
import ProtectedRoute from './protectRoutes';
import Subscriptions from './pages/subscriptions';
import { LearningDataProvider } from './context/learningDataProvider';

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
                <LearningDataProvider>
                  <DashBoard />
                </LearningDataProvider>
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
