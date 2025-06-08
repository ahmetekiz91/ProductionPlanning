import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import Home from './Home';
import NotFound from './NotFound';
import Login from './Login';
import { isAuthenticated } from '../Helper/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Chatbot from '../Chatbot/ChatbotN';
import VoiceAssistant from '../Voiceassistant/VoiceAssistant';
import Item from './ItemsPage';
import GoogleSearchSimulator from './GoogleSearchSimulator';
import ProductionOrderComponent from './ProductionOrderComponent';
import Chatbox from '../Chatbot/Chatbot';
import UserPage from './UsersPage';
import GanttChart from '../components/GanttChart';
import ProductionLineComponent from './ProductionLineComponent';
import SubMachinesComponent from './SubMachinesComponent';


const AppRouter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [submenuOpen, setSubmenuOpen] = useState<{ [key: string]: boolean }>({
    finance: false,
    nlp: false,
    item: false,
    sales: false,
    currentaccount:false,
    production:false,
    inventory:false,
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSubmenu = (menu: string) =>
    setSubmenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));

  useEffect(() => {
    isAuthenticated()
      .then((result) => setAuthenticated(result))
      .catch(() => setAuthenticated(false))
      .finally(() => {
        if (authenticated === false) navigate('/login');
      });
  }, [authenticated, navigate]);

  if (authenticated === null) return null;

  return (
    <div className="row">
      <div className={`wrapper ${sidebarOpen ? 'sidebar-active' : ''}`}>
        {!isLoginPage && authenticated && (
          <nav id="sidebar" className={`${sidebarOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
              <h3>X Company MERP</h3>
            </div>
            <ul className="list-unstyled components">
              <li><Link to="/">Home</Link></li>


              <li className={submenuOpen.item ? 'active' : ''}>
                <a onClick={() => toggleSubmenu('item')}>Item Management</a>
                <ul className={`collapse list-unstyled ${submenuOpen.item ? 'show' : ''}`}>
                  <li><Link to="/item">Items</Link></li>

                </ul>
              </li>

              <li className={submenuOpen.production ? 'active' : ''}>
                <a onClick={() => toggleSubmenu('production')}>Production</a>
                <ul className={`collapse list-unstyled ${submenuOpen.production ? 'show' : ''}`}>
                  <li><Link to="/machinesechedule">Machine Schedule</Link></li>
                  <li><Link to="/productionordercomponent">Production Orders</Link></li>
                  <li><Link to="/productionline">Production Line</Link></li>
                  <li><Link to="/submachines">Sub Machines</Link></li>
                  
                </ul>
              </li>

              <li><Link to="/users">Users</Link></li>



            </ul>
          </nav>
        )}

        <div id="content" >
          {!isLoginPage && authenticated && (
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#6d7fcc' }}>
              <div>
                <a onClick={toggleSidebar} id="sidebarCollapse" style={{ backgroundColor: '#7386D5', color: 'white' }}>
                  <FontAwesomeIcon icon={faBars} className="text-white" />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav mr-auto"></ul>
                  <ul className="navbar-nav ml-auto"></ul>
                </div>
              </div>
            </nav>
            
          )}
   
          <Routes>
          
            <Route path="/" element={<Home />} />
            <Route path="/productionordercomponent" element={<ProductionOrderComponent />} />         
            <Route path="/login" element={<Login />} />

            <Route path="/chatbot" element={<Chatbot />} />

            <Route path="/item" element={<Item />} />
      
            <Route path="/GoogleSearchSimulator" element={<GoogleSearchSimulator />} />
            <Route path="/voiceassistant" element={<VoiceAssistant />} />

            <Route path="/users" element={<UserPage />} /> 

            <Route path="/productionline" element={<ProductionLineComponent />} /> 
            <Route path="/machinesechedule" element={<GanttChart/>} />  
            <Route path="/submachines" element={<SubMachinesComponent/>} />  
           
            <Route path="*" element={<NotFound />} />
          </Routes>      
        </div>
        <Chatbox/> 
      </div>

    </div>
  );
};

export default AppRouter;
