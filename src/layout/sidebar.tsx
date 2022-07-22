import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BalanceIcon,
  CreatoCoinIcon,
  Dare2Icon,
  RewardIcon,
  NoOfPeopleIcon,
  NotificationfillIcon,
  SettingIcon,
  LightbulbIcon,
  TipIcon
} from "../assets/svg";
import "../assets/styles/sidebarStyle.scss";

const NavLink = (props: any) => {
  const isActive = props.pathname.indexOf(props.to) !== -1 ? props.to === "/admin" && props.to !== props.pathname ? false : true : false;

  useEffect(() => {
    if (isActive) props.setActivePath(props.to);
  }, [isActive]);

  return (
    <Link to={props.to} className={isActive ? "list-item active" : "list-item"}
      onMouseOver={() => { props.setHoverPath(props.to) }}
      onMouseLeave={() => { props.setHoverPath("") }} >
      {props.children}
    </Link>
  )
}

const Sidebar = () => {
  const location = useLocation();
  const [hoverPath, setHoverPath] = useState("");
  const [activePath, setActivePath] = useState("");

  return (
    <div className="sidebar-wrapper">
      <div className="list">
        <NavLink to="/admin" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <CreatoCoinIcon className="icon-svg" color={activePath === '/admin' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Homepage</span>
          </div>
        </NavLink>
        <NavLink to="/admin/daremes" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <LightbulbIcon className="icon-svg" color={location.pathname.indexOf('/admin/daremes') !== -1 ? "#EFA058" : hoverPath === "/admin/daremes" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>DareMe</span>
          </div>
        </NavLink>
        <NavLink to="/admin/fundmes" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <Dare2Icon className="icon-svg" color={location.pathname.indexOf('/admin/fundmes') !== -1 ? "#EFA058" : hoverPath === "/admin/fundmes" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>FundMe</span>
          </div>
        </NavLink>
        <NavLink to="/admin/fanwalls" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <RewardIcon className="icon-svg" color={activePath === '/admin/fanwalls' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin/fanwalls" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Fanwall</span>
          </div>
        </NavLink>
        <NavLink to="/admin/shop" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <CreatoCoinIcon className="icon-svg" color={activePath === '/admin/shop' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin/shop" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Donuts Shop</span>
          </div>
        </NavLink>
        <NavLink to="/admin/transactions" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <BalanceIcon className="icon-svg" color={activePath === '/admin/transactions' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin/transactions" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Transaction - Donuts</span>
          </div>
        </NavLink>
        <NavLink to="/admin/users" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <NoOfPeopleIcon className="icon-svg" color={activePath === '/admin/users' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin/users" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Profile - Users</span>
          </div>
        </NavLink>
        <NavLink to="/admin/notifications" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <NotificationfillIcon className="icon-svg" color={activePath === '/admin/notifications' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin/notifications" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Notifications</span>
          </div>
        </NavLink>
        <NavLink to="/admin/referral-links" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <SettingIcon className="icon-svg" color={activePath === '/admin/referral-links' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin/referral-links" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Referral link</span>
          </div>
        </NavLink>
        <NavLink to="/admin/general-setting" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <SettingIcon className="icon-svg" color={activePath === '/admin/general-setting' && activePath === location.pathname ? "#EFA058" : hoverPath === "/admin/general-setting" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>General - Admin setting</span>
          </div>
        </NavLink>
        <NavLink to="/admin/tipping" pathname={location.pathname} setHoverPath={setHoverPath} setActivePath={setActivePath}>
          <div className="icon">
            <TipIcon className="icon-svg" color={location.pathname.indexOf('/admin/tipping') !== -1 ? "#EFA058" : hoverPath === "/admin/tipping" ? "#EFA058" : "#A6A29F"} />
          </div>
          <div className="item-letter">
            <span>Tipping</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
