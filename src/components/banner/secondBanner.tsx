import { useNavigate } from "react-router-dom";
import BannerImg from "../../assets/img/secondBanner.png";
import "../../assets/styles/banner/secondBannerStyle.scss";

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className="second-banner-wrapper" onClick={() => { navigate('/auth/signin') }}>
            <img src={BannerImg} alt="Banner Img" className="banner-image" />
        </div>
    )
}

export default Banner;