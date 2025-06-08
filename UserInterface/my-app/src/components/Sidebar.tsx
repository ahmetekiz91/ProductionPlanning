import React, { useState,useEffect } from 'react';

const Sidebar  = (showSidebar:any ) => {
    const [sidebarOpen, setSidebarOpen] = useState(showSidebar);
    const [homeSubmenuOpen, setHomeSubmenuOpen] = useState(false);
    const [pageSubmenuOpen, setPageSubmenuOpen] = useState(false);

    useEffect(() => {
        setSidebarOpen(showSidebar);
    }, [showSidebar]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleHomeSubmenu = () => {
        setHomeSubmenuOpen(!homeSubmenuOpen);
    };

    const togglePageSubmenu = () => {
        setPageSubmenuOpen(!pageSubmenuOpen);
    };

    return (
        <div className='col-3'>
<div className={`wrapper ${sidebarOpen ? 'sidebar-active' : ''}`}>
            <nav id="sidebar" className={` ${sidebarOpen ? ' active' : ''}`}>
                <div className="sidebar-header">
                    <h3>Bootstrap Sidebar</h3>
                </div>

                <ul className="list-unstyled components">
                    
                    <li>
                        <a href="#">About</a>
                    </li>
                    <li className={pageSubmenuOpen ? 'active' : ''}>
                        <a onClick={togglePageSubmenu}>Pages</a>
                        <ul className={`collapse list-unstyled ${pageSubmenuOpen ? 'show' : ''}`} id="pageSubmenu">
                            <li>
                                <a href="#">Page 1</a>
                            </li>
                            <li>
                                <a href="#">Page 2</a>
                            </li>
                            <li>
                                <a href="#">Page 3</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">Portfolio</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>

            </nav>

            <div id="content">
                <button onClick={toggleSidebar} type="button" id="sidebarCollapse" className="btn btn-info">
                    <i className="fas fa-align-left"></i>
                    <span>{sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}</span>
                </button>

                {/* Rest of the content */}
            </div>
        </div>
        </div>
        
    );
};

export default Sidebar;
