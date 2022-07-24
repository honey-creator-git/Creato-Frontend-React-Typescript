import { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../../components/general/button';
import { tipAction } from '../../../redux/actions/tipActions';
import { LanguageContext } from '../../../routes/authRoute';
import { CreatoCoinIcon, ProfileIcon } from '../../../assets/svg';
import '../../../assets/styles/admin/tip/adminTipStyle.scss';

const Tipping = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tips = useSelector((state: any) => state.fanwall.tips);
    const users = useSelector((state: any) => state.auth.users);
    const [type, setType] = useState(0);
    const contexts = useContext(LanguageContext);

    useEffect(() => {
        if (type === 0) dispatch(tipAction.getTips());
        else dispatch(tipAction.getActiveTipUsers());
    }, [type]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <>
            <div className="admin-tip-wrapper">
                <div className="tip-header">
                    <span>{type === 0 ? "Tip Record" : "Tip Owners"}</span>
                </div>
                <div className="change-btns">
                    <div style={{ width: '120px' }}>
                        <Button
                            text="Tip Record"
                            fillStyle={type === 1 ? "outline" : "fill"}
                            color="primary"
                            handleSubmit={() => { setType(0) }}
                        />
                    </div>
                    <div style={{ width: '120px' }}>
                        <Button
                            text="Tip Owners"
                            fillStyle={type === 0 ? "outline" : "fill"}
                            color="primary"
                            handleSubmit={() => { setType(1) }}
                        />
                    </div>
                </div>
                <div className="tip-data">
                    <table className="data-table">
                        {type === 0 ?
                            <>
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
                            </>
                            :
                            <>
                                <thead>
                                    <tr>
                                        <th>DOJ</th>
                                        <th>Username</th>
                                        <th>Category</th>
                                        <th>Personalised Url</th>
                                        <th>Email</th>
                                        <th>Donuts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user: any, index: any) => (
                                        <tr key={index}>
                                            <td>{new Date(user?.date).toUTCString().slice(5, 11)} {new Date(user?.date).toUTCString().slice(14, 16)}</td>
                                            <td style={{ color: '#F2B176' }}>{user?.name}</td>
                                            <td>
                                                {user.categories && user?.categories.map((category: any, i: any, array: any) => (
                                                    <span key={i}>{contexts.CREATOR_CATEGORY_LIST[category]}{i !== array.length - 1 && "/"}</span>
                                                ))}
                                            </td>
                                            <td>{user?.personalisedUrl}</td>
                                            <td>{user?.email}</td>
                                            <td>{user.role === "ADMIN" ? '***' : user.wallet ? (user?.wallet).toLocaleString() : '0'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        }
                    </table>
                </div>
            </div>
        </>
    );
}

export default Tipping;