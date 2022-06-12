import { useState } from "react";

interface containerBtnProps {
  styleType?: string; // fill outline
  text?: string;
  icon?: any;
  disabled?: boolean;
  bgColor?: string;
}

const ContainerBtn = (props: containerBtnProps) => {
  const [status, setStatus] = useState("default");
  const style = props.styleType;
  const text = props.text;
  const icon = props.icon;

  const backgroundColor = 
    props.disabled === true
      ? "#E1E0DF"
      : style === "fill"
      ? "#EFA058"
      : "white";
  const backgroundHoverColor = "#F5C395";
  const backgroundPressedColor = "#EA8426";

  const fontColor = 
   props.disabled === true
      ? "#938D8A"
      : style === "fill"
      ? "white"
      : "#EFA058";

  const disabledStyle = {
    cursor: "not-allowed",
    width: "100%",
    height: "50px",
    backgroundColor: backgroundColor,
    color: fontColor,
    border: `1px solid #E1E0DF`,
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const fillStyle = {
    cursor: "pointer",
    width: "100%",
    height: "50px",
    backgroundColor: props.bgColor !== undefined ? props.bgColor :
      ( status === "default"
        ? backgroundColor
        : status === "hover"
        ? backgroundHoverColor
        : backgroundPressedColor ),
    color: props.bgColor !== undefined ? 'white' : (status === "default" ? fontColor : "white"),
    border: props.bgColor !== undefined ? `1px solid ${props.bgColor}` :
      (status === "default"
        ? "1px solid #EFA058"
        : status === "hover"
        ? `1px solid ${backgroundHoverColor}`
        : `1px solid ${backgroundPressedColor}`) ,
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.3s",
  };

  const fontStyle = {
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "20px",
    textAlign: "center" as const,
    letterSpacing: "0.05em",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const iconStyle = {
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  let btnStyle = props.disabled === true ? disabledStyle : fillStyle;

  return (
    <div
      style={btnStyle}
      onMouseOver={() => setStatus("hover")}
      onMouseLeave={() => setStatus("default")}
      onMouseDown={() => setStatus("pressed")}
    >
      <div style={fontStyle}>
        {icon !== undefined && (
          <div style={iconStyle}>
            {style === undefined
              ? icon[0]
              : status === "default"
              ? icon[0]
              : icon[1]}
          </div>
        )}
        {text}
      </div>
    </div>
  );
};
export default ContainerBtn;
