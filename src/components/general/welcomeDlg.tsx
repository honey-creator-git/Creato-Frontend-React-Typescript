
import { useContext } from "react";
import Button from "./button";
import { CloseIcon, TipIcon } from "../../assets/svg";
import { LanguageContext } from "../../routes/authRoute";
import "../../assets/styles/dialogStyle.scss";

const WelcomeDlg = (props: any) => {
  const { display, exit, context, buttons, icon, wrapExit, subTitle, } = props;
  const contexts = useContext(LanguageContext)

  return (
    <div className="dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
      <div className="dialog-main" onClick={e => e.stopPropagation()}>
        {icon && icon.pos === 0 && <div className="big-icon">{icon.icon}</div>}
        {exit &&
          <div className="dialog-header" style={exit ? { marginBottom: '16px' } : { justifyContent: 'center', marginBottom: '8px' }}>
            <div className="dialog-title">
              {contexts.WELCOME_DLG.TITLE}
            </div>
            {exit &&
              <div onClick={exit}>
                <CloseIcon color="black" />
              </div>
            }
          </div>
        }
        <div className="big-icon"><TipIcon color="#EA8426" width={80} /></div>
        {subTitle &&
          <div className="dialog-subcontext-top-header">
            <span style={{ whiteSpace: 'pre-line' }}>{subTitle}</span>
          </div>
        }
        <div className="dialog-context">
          <span style={{ whiteSpace: 'pre-line' }}>{context}</span>
        </div>

        <div className="dialog-subcontext-top-header">
          <span style={{ whiteSpace: 'pre-line' }}>{contexts.WELCOME_DLG.SUBTITLE}</span>
        </div>
        <div className="dialog-subcontext-header">
          <span style={{ whiteSpace: 'pre-line' }}>{contexts.WELCOME_DLG.HOW_IT_WORKS}</span>
        </div>
        <div className="dialog-subcontext">
          <div style={{ marginTop: '10px' }}>{contexts.WELCOME_DLG.LINE1}</div>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>{contexts.WELCOME_DLG.LINE2}&nbsp;&nbsp;</div>
            <div style={{ backgroundColor: '#EA8426', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '25px', height: '25px', borderRadius: '50%' }}>
              <TipIcon color="white" width={18} />
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>{contexts.WELCOME_DLG.LINE3}</div>
          <div style={{ marginTop: '10px' }}>{contexts.WELCOME_DLG.LINE4}</div>
        </div>

        {buttons &&
          <div className="dialog-buttons" style={buttons.length === 2 ? { justifyContent: 'space-between' } : {}}>
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
        }
      </div>
    </div>
  );
}

export default WelcomeDlg;