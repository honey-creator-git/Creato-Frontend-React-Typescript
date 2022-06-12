import { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { daremeAction } from "../../../redux/actions/daremeActions";
import { HiddenIcon, SearchIcon } from "../../../assets/svg";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_PREVIOUS_ROUTE } from "../../../redux/types";
import "../../../assets/styles/admin/dareme/adminDareMeListStyle.scss";

const DareMeList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const daremeState = useSelector((state: any) => state.dareme);
    const daremes = daremeState.daremes;
    const contexts = useContext(LanguageContext);
    const [search, setSearch] = useState("");

    const calc = (time: any) => {
        if (time > 1) return Math.ceil(time) + " days";
        if ((time * 24) > 1) return Math.ceil(time * 24) + " hours";
        if ((time * 24 * 60) > 1) return Math.ceil(time * 24 * 60) + " mins";
        if (time > 0) return "1 min";
        else return "Ended";

    }

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(daremeAction.getDareMeList(""));
    }, [location]);

    return (
        <div className="admin-daremes-wrapper">
            <div className="search-bar">
                <SearchIcon color="#EFA058" />
                <input className="search-input" onChange={(e) => { setSearch(e.target.value) }} onKeyUp={(e) => {
                    // if(e.keyCode === 13) dispatch(authAction.getUsersData(search)) 
                }} />
            </div>
            <div className="daremes-data">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Username</th>
                            <th>Owner Category</th>
                            <th>Donuts</th>
                            <th style={{ paddingLeft: '18px' }}>DareMe Title</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daremes.map((dareme: any, index: any) => (
                            <tr key={index}>
                                <td>{new Date(dareme.date).toLocaleDateString()}</td>
                                <td>{calc(dareme.time)}</td>
                                <td style={{ color: '#F2B176' }}>{dareme.owner.name}</td>
                                <td>
                                    {dareme.owner.categories.map((category: any, i: any, array: any) => (
                                        <span key={i}>{contexts.CREATOR_CATEGORY_LIST[category]}{i !== array.length - 1 && "/"}</span>
                                    ))}
                                </td>
                                <td>{dareme.wallet}</td>
                                <td onClick={() => {
                                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: '/admin/daremes' });
                                    navigate('/admin/daremes/details/' + dareme.id);
                                }}>
                                    <div className="dareme-title">
                                        {!dareme.show && <HiddenIcon color="#efa058" />}
                                        <div style={ dareme.show ? { marginLeft: '26px' } : { marginLeft: '2px' } } >{dareme.title}</div>
                                    </div>
                                </td>
                                <td>{contexts.DAREME_CATEGORY_LIST[dareme.category - 1]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DareMeList;