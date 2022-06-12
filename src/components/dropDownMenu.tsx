import React, { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "../assets/svg";
import CategoryBtn from "./general/categoryBtn";
import "../assets/styles/dropDownMenuStyle.scss";

interface dropDownMenuProps {
  title: string;
  categories: string[];
  size: string;
}

const DropDownMenu = (props: dropDownMenuProps) => {
  const primaryColor = "#EFA058";
  const black = "#54504E";

  const [status, setStatus] = useState<string>("default");
  const [open, setOpen] = useState<Boolean>(false);
  const color = open === true || status === "hover" ? primaryColor : black;
  const style = {
    container: {
      position: 'relative',
      width: props.size === "small" ? "189px" : "320px",
    },
    wrapper: {
      position: "relative" as const,
      left: '0',
      top: '0',
      width: '100%',
      height: "48px",
      boxSizing: "border-box" as const,
      borderRadius: "10px",
      border: "1px solid",
      borderColor: color,
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "white",
      alignItems: "center",
      padding: "0 20px",
      transition: "0.3s",
      zIndex: "2",
      cursor: 'pointer'
    },
    title: {
      color: color,
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "19px",
      letterSpacing: "0.05em",
    },
    icon: {
      // visibility: open === true ? "hidden" : "visible",
    },
    menu: {
      position: "absolute" as const,
      boxSizing: "border-box" as const,
      width: "100%",
      height: "fit-content",
      left: "0",
      top: "0",
      paddingTop: "55px",
      borderRadius: "10px",
      boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.15)",
      display: "flex",
      flexWrap: "wrap",
      visibility: open === false ? "hidden" : "visible",
      opacity: open === false ? "0" : "1",
      transition: "0.3s",
      padding: "65px 10px 10px 20px",
      zIndex: "1",
      backgroundColor: "white",
    },
    category: {
      padding: "5px",
    },
  };

  return (
    <div style={style.container as React.CSSProperties}>
      <div
        style={style.wrapper as React.CSSProperties}
        onMouseOver={() => setStatus("hover")}
        onMouseLeave={() => setStatus("default")}
        onClick={() => setOpen(!open)}
      >
        <div style={style.title as React.CSSProperties}>{props.title}</div>
        <div style={style.icon as React.CSSProperties}>
          {open ? (
            <ArrowUpIcon color={color} />
          ) : (
            <ArrowDownIcon color={color} />
          )}
        </div>
      </div>
      <div style={style.menu as React.CSSProperties}>
        {props.categories.map((category, i) => (
          <div style={style.category}>
            <CategoryBtn color="primary" text={category} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropDownMenu;
