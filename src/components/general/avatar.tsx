import React from "react";
import { useState } from "react";

const Avatar = (props: any) => {
  const { size, avatarStyle, category, username, avatar, handleClick, hover } = props;
  const [status, setStatus] = useState("default");
  let imgSize = size === "small" ? "34px" : size === "mobile" ? "70px" : size === "web" ? "120px" : "34px" ;

  const myStyle = {
    cursor: 'pointer',
    display: "flex",
    position: "relative",
    flexDirection: avatarStyle === "horizontal" ? "row" : "column",
    // justifyContent: "center",
    alignItems: "center",
  };

  const myStyle1 = {
    opacity: hover ? status === "hover" && size === "mobile" ? "0" : "1" : "1",
    transition: "0.3s",
  };

  const imgStyle = {
    width: imgSize,
    height: imgSize,
    borderRadius: imgSize,
    border: status === "hover" ? "2px solid #EFA058" : "2px solid rgba(0,0,0,0)",
    position: "relative" as const,
    cursor: "pointer",
    transition: "0.3s",
    overflow: "hidden",
  };

  const image = {
    objectFit: "contain",
    height: '100%'
  };

  const nameStyle = {
    textAlign: avatarStyle === "horizontal" ? "left" : "center",
    padding: "0",
    margin: "0px 5px",
    fontSize: size === "small" ? "12px" : "16px",
    fontWeight: "bold",
    display: avatarStyle === "noname" ? "none" : "block",
  };

  const cartegoryStyle = {
    padding: "0",
    margin: "0px 5px",
    fontSize: "12px",
    display: category === (undefined || "") ? "none" : "block",
  };

  const usernameStyle = {
    padding: "3px",
    backgroundColor: status === "hover" ? "#F8D4B3" : "rgba(0,0,0,0)",
    borderRadius: "5px",
    fontSize: "12px",
    marginBottom: "5px",
    opacity: hover ? status === "hover" && size === "mobile" ? "1" : "0" : "0",
    transition: "0.3s",
    textAlign: "center" as const,
    color: "white",
    position: "absolute" as const,
    transform: "translateX(-50%)",
    left: "50%",
    bottom: "100%",
    width: "fit-content",
  };

  const Style = {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    position: "relative" as const,
  };
  return (
    <div
      style={myStyle as React.CSSProperties}
      onMouseOver={() => setStatus("hover")}
      onMouseLeave={() => setStatus("default")}
      onClick={handleClick}
    >
      <div style={Style}>
        <div style={usernameStyle}>{username}</div>
        <div style={imgStyle}>
          <img src={avatar} alt="avatar" style={image as React.CSSProperties} />
        </div>
      </div>
      <div style={myStyle1 as React.CSSProperties}>
        {hover !== true &&
          <p style={nameStyle as React.CSSProperties}>{username}</p>
        }
        <p style={cartegoryStyle}>{category}</p>
      </div>
    </div>
  );
};

export default Avatar;
