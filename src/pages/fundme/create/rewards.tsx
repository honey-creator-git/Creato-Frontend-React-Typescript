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
import { SET_FUNDME } from "../../../redux/types";
import { LanguageContext } from "../../../routes/authRoute";
import { HotIcon } from "../../../assets/svg";
import "../../../assets/styles/fundme/create/rewards.scss";

const categoris = CONSTANT.FUNDME_REWARDS;

const FundmeRewards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fundmeStore = useSelector((state: any) => state.fundme);
  const fundmeState = fundmeStore.fundme;
  const contexts = useContext(LanguageContext);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(fundmeState.rewardText ? fundmeState.rewardText : "");
  const [reward, setReward] = useState(fundmeState.reward ? fundmeState.reward : 10);
  const [open, setOpen] = useState<boolean>(false);

  const handleSave = () => {
    const state = { ...fundmeState, rewardText: title === "" ? null : title, reward: reward };
    dispatch({ type: SET_FUNDME, payload: state });
    navigate("/fundme/create");
  };

  useEffect(() => { window.scrollTo(0, 0) }, []);

  return (
    <>
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.REWARDS_TITLE}
          back={() => {
            if (fundmeState.rewardText !== title) {
              if (fundmeState.rewardText === null && title === "") navigate("/fundme/create/");
              else setOpen(true);
            } else navigate("/fundme/create");
          }}
          hint={() => { }}
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
          title={contexts.HINT.TITLE.FUNDME_TITLE}
          context={contexts.HINT.BODY_LETTER.FUNDME_TITLE}
        />
        <div className="headerSet">
          <HotIcon color="#EFA058" />
          <span>&nbsp;Donuts</span>
        </div>
        <div className="donuts-number" style={{ marginTop: '20px' }}>
          <label>Number of Donuts</label>
          <Input
            type="input"
            isNumber={true}
            title={reward}
            width={100}
            minnum={10}
            maxnum={10000}
            step={1}
            setTitle={setReward}
            setFocus={() => { }}
          />
        </div>
        <div className="audience-letter">For audience to entitle as a SuperFan.</div>
        <div className="headerSet">
          <HotIcon color="#EFA058" />
          <span>&nbsp;Reward For SuperFans</span>
        </div>
        <div className="title-input">
          <Input
            type="input"
            placeholder="e.g. exclusive chat, signed postcard etc"
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

export default FundmeRewards;
