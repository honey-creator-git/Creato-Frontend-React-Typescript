import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "./general/button"
import { TipIcon, Dare2Icon, ProfileIcon, AddIcon } from "../assets/svg"
import CreatePart from "../assets/img/create_part.png"
import TippingPart from "../assets/img/tipping_part.png"
import FanwallPart from "../assets/img/fanwall_part.png"
import "../assets/styles/letStartedStyle.scss"

const LetStarted = (props: any) => {
  const navigate = useNavigate()
  const { type, setType, user } = props
  const [hover1, setHover1] = useState(false)
  const [hover2, setHover2] = useState(false)
  const [hover3, setHover3] = useState(false)

  return (
    <div className="let-start-wrapper">
      <div className={type === 0 ? "open-status" : "close-status"}
        onClick={() => { 
          setType(0) 
          window.scrollTo(0, 0)
        }}
        onMouseOver={() => { setHover1(true) }}
        onMouseOut={() => { setHover1(false) }}
      >
        <div className="title-part">
          <div className="icon">
            <Dare2Icon color={(type === 0 || hover1 === true) ? "#EFA058" : "#938D8A"} width={30} height={30} />
          </div>
          <div className="letter">
            <span>DareMe/FundMe</span>
          </div>
        </div>
        {type === 0 &&
          <div className="action-part">
            <div>
              <Dare2Icon color="#EFA058" width={200} height={200} />
            </div>
            <div className="action-title">
              <span>DareMe/FundMe</span>
            </div>
            <div className="action-content" style={{ marginTop: '20px' }}>
              <span>Create Content Together</span>
            </div>
            <div className="buttons" style={{ marginTop: '30px' }}>
              <Button
                width={270}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Create"}
                icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                handleSubmit={() => { navigate('/create') }}
              />
            </div>
          </div>
        }
        {type === 0 &&
          <div className="image">
            <div className="image-letter">
              <span>Where the journey start</span>
            </div>
            <img src={CreatePart} alt="Create" width="100%" />
            <div className="image-button">
              <Button
                width={250}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Create"}
                icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                handleSubmit={() => { navigate('/create') }}
              />
            </div>
          </div>
        }
      </div>
      <div className={type === 1 ? "open-status" : "close-status"}
        onClick={() => { 
          setType(1)
          window.scrollTo(0, 0)
        }}
        onMouseOver={() => { setHover2(true) }}
        onMouseOut={() => { setHover2(false) }}
      >
        <div className="title-part">
          <div className="icon">
            <TipIcon color={(type === 1 || hover2 === true) ? "#EFA058" : "#938D8A"} width={30} height={30} />
          </div>
          <div className="letter">
            <span>Tipping</span>
          </div>
        </div>
        {type === 1 &&
          <div className="action-part">
            <div>
              <TipIcon color="#EFA058" width={200} height={200} />
            </div>
            <div className="action-title">
              <span>Tipping</span>
            </div>
            <div className="action-content" style={{ marginTop: '20px' }}>
              <span>Donate To Support</span>
            </div>
            <div className="buttons" style={{ marginTop: '30px' }}>
              <Button
                width={270}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Tip Donuts"}
                icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
                handleSubmit={() => { navigate('/creators') }}
              />
            </div>
          </div>
        }
        {type === 1 &&
          <div className="image">
            <div className="image-letter">
              <span>Send support to creators</span>
            </div>
            <img src={TippingPart} alt="Create" width="100%" />
            <div className="image-button">
              <Button
                width={250}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Tip Donuts"}
                icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
                handleSubmit={() => { navigate('/creators') }}
              />
            </div>
          </div>
        }
      </div>
      <div className={type === 2 ? "open-status" : "close-status"}
        onClick={() => { 
          setType(2)
          window.scrollTo(0, 0)
        }}
        onMouseOver={() => { setHover3(true) }}
        onMouseOut={() => { setHover3(false) }}
      >
        <div className="title-part">
          <div className="icon">
            <ProfileIcon color={(type === 2 || hover3 === true) ? "#EFA058" : "#938D8A"} width={32} height={32} />
          </div>
          <div className="letter">
            <span>FanWall</span>
          </div>
        </div>
        {type === 2 &&
          <div className="action-part">
            <div>
              <ProfileIcon color="#EFA058" width={200} height={200} />
            </div>
            <div className="action-title">
              <span>FanWall</span>
            </div>
            <div className="action-content" style={{ marginTop: '20px' }}>
              <span>For Fans & Creators</span>
            </div>
            <div className="buttons" style={{ marginTop: '30px' }}>
              <div>
                <Button
                  width={270}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"Creator’s FanWall"}
                  handleSubmit={() => { navigate('/creators') }}
                />
              </div>
              <div style={{ marginTop: '5px' }}>
                <Button
                  width={270}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"View my FanWall"}
                  handleSubmit={() => {
                    if (user) navigate(`/${user.personalisedUrl}`)
                    else navigate('/auth/signin')
                  }}
                />
              </div>
            </div>
          </div>
        }
        {type === 2 &&
          <div className="image">
            <div className="image-letter">
              <span>Organized your activities</span>
            </div>
            <img src={FanwallPart} alt="Create" width="100%" />
            <div className="image-button">
              <div>
                <Button
                  width={250}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"Creator’s FanWall"}
                  handleSubmit={() => { navigate('/creators') }}
                />
              </div>
              <div style={{ marginTop: '5px' }}>
                <Button
                  width={250}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"View my FanWall"}
                  handleSubmit={() => {
                    if (user) navigate(`/${user.personalisedUrl}`)
                    else navigate('/auth/signin')
                  }}
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default LetStarted