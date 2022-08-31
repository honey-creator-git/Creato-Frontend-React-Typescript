import { useNavigate } from "react-router-dom"
import '../assets/styles/profile/components/profileMenuStyle.scss'

const ProfileMenu = (props: any) => {
  const { url } = props
  const navigate = useNavigate()
  
  return (
    <div className="profile-menu-wrapper">
      <div className={props.menu === "dareme" ? "dareme-fanwall-active" : 'dareme-fanwall'} onClick={() => { navigate(`/${url}`) }}>
        DareMe & FundMe
      </div>
      <div className={props.menu === "dareme" ? "dareme-fanwall" : 'dareme-fanwall-active'} onClick={() => { navigate(`/${url}/fanwall`) }}>
        Fan Wall
      </div>
    </div>
  );
};

export default ProfileMenu;
