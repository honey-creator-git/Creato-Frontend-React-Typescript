import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import Hint from "../../../components/general/hint";
import Input from "../../../components/general/input";
import Dialog from "../../../components/general/dialog";
import Title from "../../../components/general/title";
import CONSTANT from "../../../constants/constant";
import { SET_DAREME } from "../../../redux/types";
import { LanguageContext } from "../../../routes/authRoute";
import "../../../assets/styles/dareme/create/daremeTitleStyle.scss";

const categoris = CONSTANT.DARE_TITLE_SUGGESTIONS;

const DaremeTitile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const daremeStore = useSelector((state: any) => state.dareme);
  const daremeState = daremeStore.dareme;
  const contexts = useContext(LanguageContext);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(daremeState.title ? daremeState.title : null);
  const [open, setOpen] = useState<boolean>(false);

  const handleSave = () => {
    const state = { ...daremeState, title: title === "" ? null : title };
    dispatch({ type: SET_DAREME, payload: state });
    navigate("/dareme/create");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.DAREME_TITLE}
          back={() => {
            if (daremeState.title !== title) {
              if (daremeState.title === null && title === "") navigate("/dareme/create");
              else setOpen(true);
            }
            else navigate("/dareme/create");
          }}
          hint={() => { setOpenHint(true); }}
        />
      </div>
      <div className="dareme-title-wrapper">
        <Dialog
          display={open}
          title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
          exit={() => { setOpen(false) }}
          wrapExit={() => { setOpen(false) }}
          context={`${contexts.DIALOG.BODY_LETTER.SAVE_DRAFT}`}
          buttons={[
            {
              text: `${contexts.DIALOG.BUTTON_LETTER.SAVE_DRAFT}`,
              handleClick: () => {
                setOpen(false);
                handleSave();
              }
            }
          ]}

        />
        <Hint
          style={{ left: "calc(100% - 336px)" }}
          open={openHint}
          exit={() => { setOpenHint(false); }}
          color="#059669"
          title={contexts.HINT.TITLE.DAREME_TITLE}
          context={contexts.HINT.BODY_LETTER.DAREME_TITLE}
        />
        <div className="title-input">
          <Input
            type="input"
            placeholder={contexts.DAREME_TITLE_LETTER.TITLE_PLACEHOLDER}
            wordCount={60}
            title={title ? title : ""}
            setTitle={setTitle}
            setFocus={() => { }}
          />
        </div>
        <div className="categories">
          <div>
            <div className="title">{contexts.DAREME_TITLE_LETTER.RECENT_TITLE}</div>
            {categoris.map((category, i) => (
              <div key={i} className="category" onClick={() => setTitle(category)}>
                <CategoryBtn color="primary" text={category} />
              </div>
            ))}
          </div>
        </div>
        <div className="save-btn" onClick={handleSave}>
          <ContainerBtn disabled={false} styleType="fill" text={contexts.DAREME_TITLE_LETTER.SAVE} />
        </div>
      </div>
    </>
  );
};

export default DaremeTitile;
