import { useState } from "react";

const Button = (props: any) => {
  const { fillStyle, color, shape, text, icon, bgColor } = props;
  const [state, setState] = useState("default");

  const backgroundColorPrimary =
    fillStyle === "fill" ? "#EFA058" : fillStyle === "outline" ? "white" : "white";
  const backgroundHoverColorPrimary =
    fillStyle === "fill" ? "#F5C395" : fillStyle === "outline" ? "#F5C395" : "#E1E0DF";
  const backgroundPressedColorPrimary =
    fillStyle === "fill" ? "#EFA058" : fillStyle === "outline" ? "#EFA058" : "white";

  const backgroundColorSecondary =
    fillStyle === "fill" ? "#E17253" : fillStyle === "outline" ? "white" : "white";
  const backgroundHoverColorSecondary =
    fillStyle === "fill" ? "#EBA18C" : fillStyle === "outline" ? "#EBA18C" : "white";
  const backgroundPressedColorSecondary =
    fillStyle === "fill" ? "#E17253" : fillStyle === "outline" ? "#E17253" : "white";

  const backgroundColorFundme =
    fillStyle === "fill" ? "#108AA1" : fillStyle === "outline" ? "white" : "white";
  const backgroundHoverColorFundme =
    fillStyle === "fill" ? "#14ADC9" : fillStyle === "outline" ? "#14ADC9" : "white";
  const backgroundPressedColorFundme =
    fillStyle === "fill" ? "#108AA1" : fillStyle === "outline" ? "#108AA1" : "white";

  const borderColorPrimary =
    fillStyle === "fill" ? "#EFA058" : fillStyle === "outline" ? "#EFA058" : "white";
  const borderHoverColorPrimary =
    fillStyle === "fill" ? "#F5C395" : fillStyle === "outline" ? "#F5C395" : "white";
  const borderPressedColorPrimary =
    fillStyle === "fill" ? "#EFA058" : fillStyle === "outline" ? "#EFA058" : "white";

  const borderColorSecondary =
    fillStyle === "fill" ? "#E17253" : fillStyle === "outline" ? "#E17253" : "white";
  const borderHoverColorSecondary =
    fillStyle === "fill" ? "#EBA18C" : fillStyle === "outline" ? "#EBA18C" : "white";
  const borderPressedColorSecondary =
    fillStyle === "fill" ? "#E17253" : fillStyle === "outline" ? "#E17253" : "white";

  const borderColorFundme =
    fillStyle === "fill" ? "#108AA1" : fillStyle === "outline" ? "#108AA1" : "white";
  const borderHoverColorFundme =
    fillStyle === "fill" ? "#14ADC9" : fillStyle === "outline" ? "#14ADC9" : "white";
  const borderPressedColorFundme =
    fillStyle === "fill" ? "#108AA1" : fillStyle === "outline" ? "#108AA1" : "white";

  const colorNofillHover = color === "primary" ? "#54504E" : "#EFA058";
  const colorNofillPressed = color === "primary" ? "#EFA058" : "#E17253";
  const borderRadius = shape === "rounded" ? "8px" : "40px";

  const disableStyle = {
    cursor: "not-allowed",
    background: "#E1E0DF",
    padding: "16px",
    borderRadius: borderRadius,
    color: "#938D8A",
    border: "1px solid #E1E0DF",
  };

  const normallStyle = {
    cursor: "pointer",
    width: props.width === undefined ? "fit-content" : props.width,
    // height: icon !== undefined ? "24px" : "",
    background: bgColor === undefined ? (
      color === "primary"
        ? state === "hover"
          ? backgroundHoverColorPrimary
          : state === "pressed"
            ? backgroundPressedColorPrimary
            : backgroundColorPrimary
        : color === "fundme"
          ? state === "hover"
            ? backgroundHoverColorFundme
            : state === "pressed"
              ? backgroundPressedColorFundme
              : backgroundColorFundme
          : state === "hover"
            ? backgroundHoverColorSecondary
            : state === "pressed"
              ? backgroundPressedColorSecondary
              : backgroundColorSecondary
    ) : bgColor,
    borderRadius: borderRadius,
    border: bgColor === undefined ? (
      color === "primary"
        ? state === "hover"
          ? `1px solid ${borderHoverColorPrimary}`
          : state === "pressed"
            ? `1px solid ${borderPressedColorPrimary}`
            : `1px solid ${borderColorPrimary}`
        : color === "fundme"
          ? state === "hover"
            ? `1px solid ${borderHoverColorFundme}`
            : state === "pressed"
              ? `1px solid ${borderPressedColorFundme}`
              : `1px solid ${borderColorFundme}`
          : state === "hover"
            ? `1px solid ${borderHoverColorSecondary}`
            : state === "pressed"
              ? `1px solid ${borderPressedColorSecondary}`
              : `1px solid ${borderColorSecondary}`) : '0px solid white',
    color: bgColor === undefined ? (
      fillStyle === "fill"
        ? "white"
        : fillStyle === "outline"
          ? state === "default"
            ? color === "primary" ? "#EFA058" : color === "fundme" ? "#14BDC7" : "white" : "white"
            : state === "default"
              ? "black"
              : state === "hover"
                ? colorNofillHover
                : colorNofillPressed) : 'white',
    padding: icon !== undefined && text === undefined ? "8px" : "16px",
    display: "flex",
    justifyContent: "center",
    transition: "0.3s",
  };

  const fontStyle = {
    fontFamily: "Lato",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "20px",
    display: "flex",
    justifyContent: "center",
  };

  const iconStyle = {
    width: text !== undefined ? "20px" : "24px",
    height: text !== undefined ? "20px" : "24px",
    marginRight: text !== undefined ? "12px" : "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  let btnStyle = (fillStyle === undefined || fillStyle === null) ? disableStyle : normallStyle;

  return (
    <div
      style={btnStyle}
      onMouseOver={() => setState("hover")}
      onMouseLeave={() => setState("default")}
      onMouseDown={() => setState("pressed")}
      onClick={props.handleSubmit}
    >
      <div style={fontStyle}>
        {icon !== undefined && (
          <div style={iconStyle}>
            {fillStyle === undefined
              ? icon[0]
              : state === "default"
                ? icon[0]
                : state === "hover"
                  ? icon[1]
                  : icon[2]}
          </div>
        )}
        {text}
      </div>
    </div>
  );
};

export default Button;
