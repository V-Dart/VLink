import {Routes, Route, Navigate} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Task from './pages/Task';
import LiveChat from './pages/LiveChat';
import PowerBI from './pages/PowerBI';
import Workspace from './pages/Workspace';
import Pipelines from './pages/Pipelines';
import Meet from './pages/Meet';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import AuthCallback from './components/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerPortal from './pages/customer';
import ClientWorkspaceConfig from './pages/ClientWorkspaceConfig';


function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/task" 
          element={
            <ProtectedRoute>
              <Task />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/livechat" 
          element={
            <ProtectedRoute>
              <LiveChat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/powerbi" 
          element={
            <ProtectedRoute>
              <PowerBI />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/workspace" 
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pipelines" 
          element={
            <ProtectedRoute>
              <Pipelines />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/meet" 
          element={
            <ProtectedRoute>
              <Meet />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/customerportal" 
          element={
            <ProtectedRoute>
              <CustomerPortal />
            </ProtectedRoute>
          } 
        />
        <Route path="/client-config" element={<ClientWorkspaceConfig />} />
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}
export default App;
