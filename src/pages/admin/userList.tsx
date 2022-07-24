import { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SearchIcon, TipIcon } from "../../assets/svg";
import { authAction } from "../../redux/actions/authActions";
import { LanguageContext } from "../../routes/authRoute";
import "../../assets/styles/admin/adminUsersStyle.scss";

const UserList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const userState = useSelector((state: any) => state.auth);
    const contexts = useContext(LanguageContext);
    const [search, setSearch] = useState("");
    const users = userState.users;

    const setTip = (tipValue: any, userId: any, index: any) => {
        dispatch(authAction.setTipFunction(tipValue, userId, users, index));
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(authAction.getUsersList(""));
    }, [location]);

    return (
        <div className="admin-users-wrapper">
            <div className="search-bar">
                <SearchIcon color="#EFA058" />
                <input className="search-input" onChange={(e) => { setSearch(e.target.value) }} onKeyUp={(e) => { if (e.keyCode === 13) dispatch(authAction.getUsersList(search)) }} />
            </div>
            <div className="users-data scroll-bar">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>DOJ</th>
                            <th>Username</th>
                            <th>Donuts</th>
                            <th>Category</th>
                            <th>Personalised Url</th>
                            <th>Email</th>
                            <th>DareMe created</th>
                            <th>Payment Status</th>
                            <th>Tip</th>
                        </tr>
                    </thead>
                    {users.length > 0 &&
                        <tbody>
                            {users.map((user: any, index: any) => (
                                <tr key={index}>
                                    <td>{new Date(user?.date).toUTCString().slice(5, 11)} {new Date(user?.date).toUTCString().slice(14, 16)}</td>
                                    <td style={{ color: '#F2B176' }}>{user?.name}</td>
                                    <td>{user.role === "ADMIN" ? '***' : user.wallet ? (user?.wallet).toLocaleString() : '0'}</td>
                                    <td>
                                        {user.categories && user?.categories.map((category: any, i: any, array: any) => (
                                            <span key={i}>{contexts.CREATOR_CATEGORY_LIST[category]}{i !== array.length - 1 && "/"}</span>
                                        ))}
                                    </td>
                                    <td>{user?.personalisedUrl}</td>
                                    <td>{user?.email}</td>
                                    <td>{user?.daremeCnt}</td>
                                    <td></td>
                                    <td>
                                        <div onClick={() => { setTip(!user?.tipFunction, user.id, index) }}>
                                            {user.tipFunction ? <TipIcon color="#F2B176" /> : <TipIcon color="grey" />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}

export default UserList;