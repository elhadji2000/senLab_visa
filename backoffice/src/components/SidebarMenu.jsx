import React, { useState } from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import {
  FaFlask,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaBars,
  FaUser,
  FaPlus,
  FaList,
  FaSignOutAlt,
  FaAtom,
  FaVial,
  FaThList,
  FaHome,
  FaCalculator,
  FaMicroscope,
} from 'react-icons/fa';
import { MdQuiz, MdAddCircle, MdListAlt } from 'react-icons/md';
import { Divider } from '@mui/material';
import './SidebarMenu.css';

const SidebarMenu = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="sidebar-container">
      {/* Toggle button */}
      <div className="menu-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </div>

      <ProSidebar collapsed={collapsed}>
        <div className="sidebar-header">
          {!collapsed && (
            <>
              <img src="/src/assets/logo-uadb.png" alt="Logo" className="sidebar-logo" />
              <h3 className="sidebar-title">Labo STEM</h3>
            </>
          )}
        </div>

        <Menu
          menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: '#1976d2',
                color: '#fff',
              },
            },
          }}
        >
          {/* Home */}
          <MenuItem icon={<FaHome />} component={<Link to="/dashboard" />}>Dashboard</MenuItem>

          {/* Utilisateur */}
          <SubMenu icon={<FaUser />} label="Utilisateur">
            <MenuItem icon={<FaPlus />} component={<Link to="/utilisateur/ajouter" />}>Ajouter</MenuItem>
            <MenuItem icon={<FaList />} component={<Link to="/utilisateur/lister" />}>Lister</MenuItem>
          </SubMenu>

          {/* Simulations */}
          <SubMenu icon={<FaFlask />} label="Simulations">
            <MenuItem icon={<FaAtom />} component={<Link to="/simulations/physique" />}>Physique</MenuItem>
            <MenuItem icon={<FaVial />} component={<Link to="/simulations/chimie" />}>Chimie</MenuItem>
            <MenuItem icon={<FaCalculator />} component={<Link to="/simulations/chimie" />}>Mathematique</MenuItem>
            <MenuItem icon={<FaMicroscope />} component={<Link to="/simulations/biologie" />}> Biologie </MenuItem>

            <Divider sx={{ my: 1, backgroundColor: '#ccc' }} /> {/* Si tu utilises MUI */}
            {/* ou simplement : <hr style={{ margin: '10px 0', borderColor: '#ccc' }} /> */}

            <MenuItem icon={<FaThList />} component={<Link to="/simulations/toutes" />}>
              Toutes les simulations
            </MenuItem>

          </SubMenu>
          {/* Gestion Quizz */}
          <SubMenu icon={<MdQuiz />} label="Gestion Quizz">
            <MenuItem icon={<MdAddCircle />} component={<Link to="/quizz/ajouter" />}>
              Créer
            </MenuItem>
            <MenuItem icon={<MdListAlt />} component={<Link to="/quizz/lister" />}>
              Tous les Quizz
            </MenuItem>
          </SubMenu>


          {/* Logout */}
          <MenuItem icon={<FaSignOutAlt />} component={<Link to="/logout" />}>Déconnexion</MenuItem>
        </Menu>
      </ProSidebar>
    </div>
  );
};

export default SidebarMenu;
