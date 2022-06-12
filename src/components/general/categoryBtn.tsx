import { useState } from "react";

interface categoryBtnProps {
  color?: string;
  text?: string;
  bgColor?: string;
  icons?: any;
  pressed?: boolean;
  disable?: boolean;
}

const CategoryBtn = (props: categoryBtnProps) => {
  const [status, setStatus] = useState("default");
  const color = props.color !== undefined ? props.color : "primary";
  const text = props.text;
  const bgColor = props.bgColor;
  const icons = props.icons;

  const backgroundColor =
    props.pressed ? "#EFA058" :
      bgColor === undefined
        ? status === "pressed"
          ? color === "primary"
            ? "#EFA058"
            : "#E17253"
          : status === "default"
            ? "white"
            : status === "hover"
              ? color === "primary"
                ? "#F5C395"
                : "#EBA18C"
              : color === "primary"
                ? "#EFA058"
                : "#E17253"
        : bgColor;
  const fontColor =
    props.pressed ? "white" :
      bgColor === undefined
        ? status === "pressed"
          ? "white"
          : status === "default"
            ? color === "primary"
              ? "#EFA058"
              : "#E17253"
            : "white"
        : "white";
  const borderColor =
    bgColor === undefined
      ? status === "default"
        ? color === "primary"
          ? "#EFA058"
          : "#E17253"
        : "rgba(0,0,0,0)"
      : "rgba(0,0,0,0)";

  const myStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Lato",
    fontSize: "16px",
    color: fontColor,
    backgroundColor: backgroundColor,
    width: "max-content",
    maxWidth: '340px',
    borderRadius: "40px",
    border: `1px solid ${borderColor}`,
    padding: "8px",
    boxSizing: "border-box" as const,
    cursor: "pointer",
    transition: "0.3s",
  };

  const disableStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Lato",
    fontSize: "16px",
    color: "#696462",
    backgroundColor: "#F5F5F4",
    width: "max-content",
    maxWidth: '340px',
    borderRadius: "40px",
    border: `1px solid #F5F5F4`,
    padding: "8px",
    boxSizing: "border-box" as const,
    cursor: "pointer",
  };

  const categoryStyle = props.disable ? disableStyle : myStyle;

  return (
    <div
      style={categoryStyle}
      onMouseOver={() => setStatus("hover")}
      onMouseLeave={() => setStatus("default")}
      onMouseDown={() => setStatus("pressed")}
    >
      {icons &&
        <>
          {status === "hover" ? icons[1] : icons[0]}
        </>
      }
      {text}
    </div>
  );
};

export default CategoryBtn;
