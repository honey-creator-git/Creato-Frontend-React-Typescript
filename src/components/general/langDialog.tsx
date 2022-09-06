import { useState, useContext } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "./button"
import { CloseIcon } from "../../assets/svg"
import { LanguageContext } from "../../routes/authRoute"
import { SET_LANGUAGE } from "../../redux/types"
import "../../assets/styles/langDialogStyle.scss"


const LangDialog = (props: any) => {
  const { langauge, display, exit, wrapExit, title, buttons } = props
  const [lang, setLang] = useState(langauge)
  const contexts = useContext(LanguageContext)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className="lang-dialog-wrapper" style={display ? { visibility: 'visible', opacity: 1 } : {}} onClick={wrapExit}>
      <div className="lang-dialog-main" onClick={e => e.stopPropagation()}>
        {(title || exit) &&
          <div className="lang-dialog-header" style={exit ? { marginBottom: '16px' } : { justifyContent: 'center', marginBottom: '8px' }}>
            <div className="lang-dialog-title">
              {title}
            </div>
            {exit &&
              <div onClick={exit}>
                <CloseIcon color="black" />
              </div>
            }
          </div>
        }
        <div className="lang-dlg-language">
          {lang === "CH" ?
            <>
              <div className="active">
                繁體中文
              </div>
              <div className="inactive" onClick={() => { setLang('EN') }}>
                English
              </div>
            </>
            :
            <>
              <div className="inactive" onClick={() => { setLang('CH') }}>
                繁體中文
              </div>
              <div className="active">
                English
              </div>
            </>
          }
        </div>
        <div className="lang-dialog-buttons">
          <Button
            color="primary"
            shape="rounded"
            fillStyle="fill"
            width="190px"
            text={contexts.GENERAL_LETTER.SAVE}
            handleSubmit={() => {
              dispatch({ type: SET_LANGUAGE, payload: lang });
              exit()
              navigate("/")
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LangDialog;