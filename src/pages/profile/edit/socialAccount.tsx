import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { GoogleLogin } from "react-google-login"
import axios from "axios"
import {
  // FacebookIcon,
  InstagramIcon,
  // TwitterIcon,
  YoutubeIcon,
} from "../../../assets/svg"
import Button from "../../../components/general/button"
import Title from "../../../components/general/title"
import CONSTANT from "../../../constants/constant"
import "../../../assets/styles/profile/socialAccountStyle.scss"

const Socialaccount = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const userState = useSelector((state: any) => state.auth);
  const user = userState.user;
  const handleSave = () => { navigate("/myaccount/edit") }

  const responseGoogleSuccess = async (response: any) => {
    const access_token = response.Cc.access_token
    const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${access_token}&key=${CONSTANT.GOOGLE_CLIENT_ID}`)
    window.open(`https://www.youtube.com/channel/${res.data.items[0].id}`)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return (
    <>
      <div className="title-header">
        <Title title="Social Accounts" back={() => { navigate(`/myaccount/edit`) }} />
      </div>
      <div className="socialaccount-wrapper">
        <div className="socialaccounts">
          {/* <div className="content">
            <div className="icon">
              <FacebookIcon color="#EFA058" />
            </div>
            <div className="title">Facebook</div>
            <div className="btn">
              <Button
                fillStyle="nofile"
                text="Connect"
                shape="pill"
                color="primary"
                handleSubmit={() => { }}
              />
            </div>
          </div> */}
          <div className="content">
            <div className="icon">
              <InstagramIcon color="#EFA058" />
            </div>
            <div className="title">Instagram</div>
            <div className="btn">
              <Button
                fillStyle="nofile"
                text="Connect"
                shape="pill"
                color="primary"
                handleSubmit={() => { }}
              />
            </div>
          </div>
          <div className="content">
            <div className="icon">
              <YoutubeIcon color="#EFA058" />
            </div>
            <div className="title">Youtube</div>
            <div className="btn">
              <GoogleLogin
                clientId={CONSTANT.GOOGLE_CLIENT_ID}
                render={(renderProps) => (
                  <Button
                    fillStyle="nofile"
                    text="Connect"
                    shape="pill"
                    color="primary"
                    handleSubmit={() => { renderProps.onClick() }}
                  />
                )}
                onSuccess={responseGoogleSuccess}
                cookiePolicy={"single_host_origin"}
                scope='https://www.googleapis.com/auth/youtube.readonly'
              />
            </div>
          </div>
          {/* <div className="content">
            <div className="icon">
              <TwitterIcon color="#EFA058" />
            </div>
            <div className="title">Twitter</div>
            <div className="btn">
              <Button
                fillStyle="nofile"
                text="Connect"
                shape="pill"
                color="primary"
                handleSubmit={() => { }}
              />
            </div>
          </div> */}
        </div>
        <div className="save-btn">
          <Button
            fillStyle="fill"
            text="Save"
            color="primary"
            shape="rounded"
            width="100px"
            handleSubmit={handleSave}
          />
        </div>
      </div>
    </>
  );
};

export default Socialaccount;
