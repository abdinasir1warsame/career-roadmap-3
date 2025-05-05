import { Navigate } from 'react-router-dom';
import { UserAuth } from './context/authContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = UserAuth();

  if (loading) {
    // Still checking auth state — block route change
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
