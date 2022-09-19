import { PRIMARY, ERROR } from "../../constants/Color"
import { useState } from "react"

const ContainerBtn = (props: any) => {
  const [status, setStatus] = useState("default")
  const { styleType, text, icon, color } = props

  const colors = color === 'primary' ? PRIMARY : color === 'error' ? ERROR : PRIMARY

  const backgroundColor = props.disabled === true ? "#E1E0DF" : styleType === "fill" ? colors[5] : "white"
  const backgroundHoverColor = colors[3]
  const backgroundPressedColor = colors[5]
  const fontColor = props.disabled === true ? "#938D8A" : styleType === "fill" ? "white" : colors[5]

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
  }

  const fillStyle = {
    cursor: "pointer",
    width: "100%",
    height: "50px",
    backgroundColor: status === "default" ? backgroundColor : status === "hover" ? backgroundHoverColor : backgroundPressedColor,
    color: status === "default" ? fontColor : "white",
    border: status === "default" ? `1px solid ${backgroundColor}` : status === "hover" ? `1px solid ${backgroundHoverColor}` : `1px solid ${backgroundPressedColor}`,
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.3s",
  }

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
  }
  const iconStyle = {
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  let btnStyle = props.disabled === true ? disabledStyle : fillStyle

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
            {styleType === undefined
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
