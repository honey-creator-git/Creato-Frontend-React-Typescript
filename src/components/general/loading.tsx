import React from "react";
import { CreatoCoinIcon } from "../../assets/svg";
import "../../assets/styles/loadingStyle.scss";

interface loadingProps {
  loading: boolean;
}
const Loading = (props: loadingProps) => {
  const { loading } = props;
  const style = {
    wrapper: {
      opacity: loading === true ? "1" : "0",
      visibility: loading === true ? "visible" : "hidden",
    },
  };
  return (
    <div
      style={style.wrapper as React.CSSProperties}
      className="loading-wrapper"
    >
      <div className="loading">
        <CreatoCoinIcon
          color="rgba(239, 160, 88, 1)"
          width="25vh"
          height="25vh"
        />
      </div>
      <div className="loading-title">Loading...</div>
    </div>
  );
};

export default Loading;
