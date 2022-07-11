import { useNavigate } from "react-router-dom";
import Button from "../general/button";
import BannerImg from "../../assets/img/firstBanner.png";
import { useSelector } from "react-redux";
import "../../assets/styles/banner/firstBannerStyle.scss";

const Banner = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);

    return (
        <div className="first-banner-wrapper" onClick={() => { if (user === null) navigate("/auth/signin") }}>
            <img src={BannerImg} alt="Banner Img" className="banner-image" />
            <div className="join-btn">
                <Button text="JOIN NOW" fillStyle="fill" color="primary" />
            </div>
        </div>
    )
}

export default Banner;