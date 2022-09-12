import DareOption from "../general/dareOption";
import Button from "../general/button";
import Avatar from "../general/avatar";
import CONSTANT from "../../constants/constant";
import { CloseIcon } from "../../assets/svg";
import "../../assets/styles/refundDlgStyle.scss";

const RefundDlg = (props: any) => {
  const { display, wrapExit, exit, title, dareme, buttons, refund, confirm } = props
  const winOption = dareme.options.filter((option: any) => option.option.win === true)[0]

  return (
    <>{winOption &&
      <div className="dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
        <div className="dialog-main" onClick={e => e.stopPropagation()}>
          <div className="dialog-header" style={exit ? { marginBottom: '16px' } : { justifyContent: 'center', marginBottom: '8px' }}>
            <div className="dialog-title">
              {title}
            </div>
            {exit &&
              <div onClick={exit}>
                <CloseIcon color="black" />
              </div>
            }
          </div>
          <div className="dialog-context">
            {confirm &&
              <div className="confirm-letter">
                <span>
                  {refund} Donuts to support {dareme.title}
                </span>
              </div>
            }
            <div className="option-card">
              <Avatar
                avatar={dareme.owner.avatar.indexOf('uploads') !== -1 ? `${CONSTANT.SERVER_URL}/${dareme.owner.avatar}` : dareme.owner.avatar}
                size="web"
                username={dareme.owner.name}
              />
              <div className="dareme-title">
                {dareme.title}
              </div>
              <div className="win-option">
                {winOption.option.writer &&
                  <DareOption
                    username={winOption.option.writer.name}
                    donuts={winOption.option.donuts}
                    voters={winOption.option.voters}
                    leading={true}
                    dareTitle={winOption.option.title}
                    disabled={false}
                  />
                }
              </div>
            </div>
          </div>
          {confirm === undefined &&
            <>
              <div className="dialog-subcontext">
                <span>
                  Still support {refund} Donuts to {dareme.owner.name} in this DareMe?
                </span>
              </div>
              <div className="support-hint">
                Yes: Donuts will be given to {dareme.owner.name}<br />
                No: Donuts will be refunded to you
              </div>
            </>
          }
          <div className="dialog-buttons">
            {
              buttons.map((button: any, index: any) => (
                <div key={index}>
                  <Button
                    color="primary"
                    shape="rounded"
                    fillStyle={index === 0 ? buttons.length === 1 ? "fill" : "outline" : "fill"}
                    width={buttons.length === 2 ? "75px" : "190px"}
                    text={button.text}
                    handleSubmit={button.handleClick}
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    }
    </>
  )
}

export default RefundDlg