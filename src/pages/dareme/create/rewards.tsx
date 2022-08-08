import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import Hint from "../../../components/general/hint";
import Input from "../../../components/general/input";
import Dialog from "../../../components/general/dialog";
import Title from "../../../components/general/title";
import { SET_DAREME } from "../../../redux/types";
import { LanguageContext } from "../../../routes/authRoute";
import { HotIcon } from "../../../assets/svg";
import "../../../assets/styles/fundme/create/rewards.scss";

const DaremeRewards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const daremeStore = useSelector((state: any) => state.dareme);
  const daremeState = daremeStore.dareme;
  const contexts = useContext(LanguageContext);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(daremeState.rewardText ? daremeState.rewardText : "");
  const [reward, setReward] = useState(daremeState.reward ? daremeState.reward : 10);
  const [open, setOpen] = useState<boolean>(false);
  const [openSet, setOpenSet] = useState(false)
  const categoris: string[] = contexts.FUNDME_REWARDS;

  const handleSave = () => {
    if(Number(reward) === 1) setOpenSet(true)
    else {
      const state = { ...daremeState, rewardText: title === "" ? null : title, reward: reward };
      dispatch({ type: SET_DAREME, payload: state });
      navigate("/dareme/create");
    }
  };

  useEffect(() => { window.scrollTo(0, 0) }, []);

  return (
    <>
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.REWARDS_TITLE}
          back={() => {
            if (daremeState.rewardText !== title) {
              if (daremeState.rewardText === null && title === "") navigate("/dareme/create/");
              else setOpen(true);
            } else navigate("/dareme/create");
          }}
          hint={() => { }}
        />
      </div>
      <div className="dareme-title-wrapper">
        <Dialog
          display={openSet}
          title="Oops!"
          exit={() => { setOpenSet(false) }}
          wrapExit={() => { setOpenSet(false) }}
          context={"At least 2 Donuts for SuperFans.🍩"}
        />
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
          title={contexts.HINT.TITLE.FUNDME_TITLE}
          context={contexts.HINT.BODY_LETTER.FUNDME_TITLE}
        />
        <div className="headerSet">
          <HotIcon color="#EFA058" />
          <span>&nbsp;{contexts.REVIEW_LETTER.DNUTS}</span>
        </div>
        <div className="donuts-number" style={{ marginTop: '20px' }}>
          <label>{contexts.REVIEW_LETTER.DONUTS_NUMBER}</label>
          <Input
            type="input"
            isNumber={true}
            title={reward}
            width={150}
            minnum={1}
            maxnum={100000000}
            step={1}
            setTitle={setReward}
            setFocus={() => { }}
          />
        </div>
        <div className="audience-letter">{contexts.REVIEW_LETTER.AUDIENCE_LETTER}</div>
        <div className="headerSet">
          <HotIcon color="#EFA058" />
          <span>&nbsp;{contexts.REVIEW_LETTER.REWARDS}</span>
        </div>
        <div className="title-input">
          <Input
            type="input"
            placeholder={contexts.REVIEW_LETTER.EXCLUSIVE_CHAT}
            wordCount={40}
            title={title}
            setTitle={setTitle}
            setFocus={() => { }}
          />
        </div>
        <div className="categories">
          {categoris.map((category, i) => (
            <div key={i} className="category" onClick={() => setTitle(category)}>
              <CategoryBtn color="primary" text={category} />
            </div>
          ))}
        </div>
        <div className="save-btn" onClick={handleSave}>
          <ContainerBtn disabled={false} styleType="fill" text={contexts.DAREME_TITLE_LETTER.SAVE} />
        </div>
      </div>
    </>
  );
};

export default DaremeRewards;
