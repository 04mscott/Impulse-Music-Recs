import './App.scss';
import Home from './Components/Home'
import SideBar from './Components/Sidebar'
import MenuToggleButton from './Components/MenuToggleButton';
import Dimmer from './Components/Dimmer'
import { useEffect, useState } from 'react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/ping-rec-api')
    .then(res => res.text())
    .then(console.log)
    .catch(err => console.error('Failed to talk to backend', err))
  }, []);

  return (
    <div className='App' >
      <MenuToggleButton onClick={toggleSidebar} className={'app-menu-button'}/>
      <Dimmer onClick={closeSidebar} className={`dimmer ${isSidebarOpen ? 'visible' : ''}`} />
      <SideBar onClose={closeSidebar} className={`sidebar ${isSidebarOpen ? 'visible' : ''}`} />
      <Home className='home'/>
    </div>
  );
}

export default App;
