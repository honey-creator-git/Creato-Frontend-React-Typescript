import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/styles/admin/adminHomeStye.scss';

const AdminHome = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="admin-home-wrapper">
            Working...
        </div>
    );
}

export default AdminHome;