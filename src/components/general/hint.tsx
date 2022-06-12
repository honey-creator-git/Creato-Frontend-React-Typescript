import { CloseIcon, LightbulbIcon } from "../../assets/svg";
import "../../assets/styles/hintStyle.scss";

const Hint = (props: any) => {
  const { color, context, title, open, exit } = props;

  const Style = {
    right: open === true ? "0px" : "-336px",
    backgroundColor: color,
  };

  return (
    <div className="hint-wrapper" style={Style}>
      <div className="hint">
        <div className="top">
          <div className="hint-title">
            <div className="hint-icon">
              <LightbulbIcon color={color} />
            </div>
            <div className="title">{title}</div>
          </div>
          <div className="cancel-icon" onClick={exit}>
            <CloseIcon color="black" />
          </div>
        </div>
        <div className="context">{context}</div>
      </div>
    </div>
  );
};

export default Hint;
