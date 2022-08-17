import { useEffect, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fundmeAction } from "../../../redux/actions/fundmeActions";
import { HiddenIcon, SearchIcon } from "../../../assets/svg";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_COVERFILE, SET_COVERINDEX, SET_PREVIOUS_ROUTE, SET_SIZETYPE, SET_VIDEOFILE } from "../../../redux/types";
import "../../../assets/styles/admin/dareme/adminDareMeListStyle.scss";

const FundMeList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const fundmeState = useSelector((state: any) => state.fundme);
    const fundmes = fundmeState.fundmes;
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
        dispatch(fundmeAction.getFundMeList(""));

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
                            <th style={{ paddingLeft: '18px' }}>FundMe Title</th>
                            <th>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fundmes.map((fundme: any, index: any) => (
                            <tr key={index}>
                                <td>{new Date(fundme.date).toLocaleDateString()}</td>
                                <td>{calc(fundme.time)}</td>
                                <td style={{ color: '#F2B176' }}>{fundme.owner.name}</td>
                                <td>
                                    {fundme.owner.categories.map((category: any, i: any, array: any) => (
                                        <span key={i}>{contexts.CREATOR_CATEGORY_LIST[category]}{i !== array.length - 1 && "/"}</span>
                                    ))}
                                </td>
                                <td>{fundme.wallet}</td>
                                <td onClick={() => {
                                    dispatch({ type: SET_COVERFILE, payload: null })
                                    dispatch({ type: SET_VIDEOFILE, payload: null })
                                    dispatch({ type: SET_SIZETYPE, payload: null })
                                    dispatch({ type: SET_COVERINDEX, payload: -1 })
                                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: '/admin/fundmes' });
                                    navigate('/admin/fundmes/details/' + fundme.id);
                                }}>
                                    <div className="dareme-title">
                                        {!fundme.show && <HiddenIcon color="#efa058" />}
                                        <div style={fundme.show ? { marginLeft: '26px' } : { marginLeft: '2px' }} >{fundme.title}</div>
                                    </div>
                                </td>
                                <td>{contexts.FUNDME_CATEGORY_LIST[fundme.category - 1]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FundMeList;