import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CloseIcon, HelpIcon } from "../../assets/svg";
import "../../assets/styles/hintStyle.scss";

const useWindowSize = () => {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() { setSize(window.innerWidth) }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const Hint = (props: any) => {
  const size = useWindowSize();
  const user = useSelector((state: any) => state.auth.user);
  const { context, title, open, exit } = props;
  const addingVal = (user && user.role === "ADMIN") ? 55 : 0;
  const height = size >= 880 ? 72 : 120 + addingVal;
  const Style = {
    right: open === true ? "0px" : "-336px",
    backgroundColor: '#EFA058',
    top: `${height}px`,
  };

  return (
    <div className="hint-wrapper" style={Style}>
      <div className="hint">
        <div className="top">
          <div className="hint-title">
            <div className="hint-icon">
              <HelpIcon />
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
