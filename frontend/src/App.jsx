import {Routes, Route} from 'react-router-dom';
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


function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/task" element={<Task />} />
        <Route path="/livechat" element={<LiveChat />} />
        <Route path="/powerbi" element={<PowerBI />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/pipelines" element={<Pipelines />} />
        <Route path="/meet" element={<Meet />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
export default App;
