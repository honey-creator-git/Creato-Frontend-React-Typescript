import { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../../components/general/title";
import Button from "../../components/general/button";
import { SET_PREVIOUS_ROUTE } from "../../redux/types";
import { LanguageContext } from "../../routes/authRoute";
import "../../assets/styles/tip/tipMethodStyle.scss";

const TipMethod = () => {
    const authuser = useSelector((state: any) => state.auth.users[0]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const contexts = useContext(LanguageContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="tip-method">
            <Title title="Join Creato" back={() => { navigate(`/${authuser.personalisedUrl}`) }} />
            <div className="tip-method-body">
                <div className="top-letter">
                    {contexts.THE_BEST_WAY_FOR_CREATORS_FANS}
                </div>
                <div className="button">
                    <Button
                        text={contexts.SIGN_UP}
                        fillStyle="fill"
                        shape="rounded"
                        color="primary"
                        width={200}
                        handleSubmit={() => { 
                            dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser.personalisedUrl}/tip` });
                            navigate("/auth/signup"); 
                        }}
                    />
                </div>
                <div className="or">
                    <div className="line"></div>
                    <div className="or-style">{contexts.OR}</div>
                    <div className="line"></div>
                </div>
                <div className="button">
                    <Button
                        text={contexts.CONTINUE_AS_VISITOR}
                        fillStyle="fill"
                        shape="rounded"
                        color="primary"
                        width={200}
                        handleSubmit={() => { navigate(`/${authuser.personalisedUrl}/tip`) }}
                    />
                </div>
            </div>
        </div>
    )
}

export default TipMethod;