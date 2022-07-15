import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../../components/general/title";
import Button from "../../components/general/button";
import { SET_PREVIOUS_ROUTE } from "../../redux/types";
import "../../assets/styles/tip/tipMethodStyle.scss";

const TipMethod = () => {
    const user = useSelector((state: any) => state.auth.user);
    const authuser = useSelector((state: any) => state.auth.users[0]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="tip-method">
            <Title title="Join Creato" back={() => { navigate(`/${authuser.personalisedUrl}`) }} />
            <div className="tip-method-body">
                <div className="top-letter">
                    The best way for Creators & Fans Communities to create together. 🙌🏻
                </div>
                <div className="button">
                    <Button
                        text="Sign Up"
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
                    <div className="or-style">or</div>
                    <div className="line"></div>
                </div>
                <div className="button">
                    <Button
                        text="Continue as Visitor"
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