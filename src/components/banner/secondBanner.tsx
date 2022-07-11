import { useNavigate } from "react-router-dom";
import BannerImg1 from "../../assets/img/banner1.png";
import BannerImg2 from "../../assets/img/banner2.png";
import BannerImg3 from "../../assets/img/banner3.png";
import { useSelector } from "react-redux";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../../assets/styles/banner/secondBannerStyle.scss";

const Banner = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);

    const navigatePage = () => {
        if (user) navigate("/create");
        else navigate("/auth/signin");
    }

    return (
        <Carousel
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            infiniteLoop={true}
            stopOnHover={false}
            swipeable={true}
            interval={4000}
        >
            <div className="second-banner-wrapper" onClick={() => { if (user === null) navigate("/auth/signin") }}>
                <img src={BannerImg1} />
            </div>
            <div className="second-banner-wrapper" onClick={navigatePage}>
                <img src={BannerImg2} />
            </div>
            <div className="second-banner-wrapper" onClick={navigatePage}>
                <img src={BannerImg3} />
            </div>
        </Carousel>
    )
}

export default Banner;