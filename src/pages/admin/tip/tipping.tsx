import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { tipAction } from '../../../redux/actions/tipActions';
import { CreatoCoinIcon, ProfileIcon } from '../../../assets/svg';
import '../../../assets/styles/admin/tip/adminTipStyle.scss';

const Tipping = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tips = useSelector((state: any) => state.fanwall.tips);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(tipAction.getTips());
    }, [location]);

    return (
        <>
            <div className="admin-tip-wrapper">
                <div className="tip-header">
                    <span>Tipping</span>
                </div>
                <div className="tip-data">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Donuts</th>
                                <th>See receiver profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tips.map((tip: any, index: any) => (
                                <tr key={index}>
                                    <td>{new Date(tip?.date).toUTCString().slice(5, 11)} {new Date(tip?.date).toUTCString().slice(14, 16)}</td>
                                    <td>{new Date(tip?.date).toUTCString().slice(17, 25)}</td>
                                    <td>{tip?.nickname ? tip.nickname : tip?.tipper ? tip.tipper.name : ''}</td>
                                    <td>{tip?.user ? tip.user.name : ''}</td>
                                    <td>
                                        <div className="donuts-type">
                                            <CreatoCoinIcon color="#27AE60" />
                                            <span style={{ color: '#27AE60' }}>
                                                {tip?.tip ? (tip?.tip * 0.95).toFixed(1).toLocaleString() : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="receiver-profile" onClick={() => { navigate(`/admin/tipping/profile/${tip?.user?.personalisedUrl}`) }}>
                                            <ProfileIcon color="#EFA058" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Tipping;