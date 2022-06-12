import React, { useState } from "react";

const ToggleBtn = () => {
  const [toggle, setToggle] = useState<boolean>(true)
  const handleToggle = () => {
    setToggle(!toggle)
  }
  const style = {
    wrapper: {
      width: "70px",
      height: "35px",
      background: toggle === true ? "#10B981" : "#CECBCA",
      borderRadius: "20px",
      boxSizing: 'border-box',
      padding: '3.5px',
      display: 'flex',
      transition: '0.2s',
      margin: '0',
      cursor: 'pointer'
    },
    btn: {
      width: '28px',
      height: '28px',
      backgroundColor: 'white',
      borderRadius: '14px',
      transition: '0.2s',
      transform: toggle? '':'translateX(35px)'
    },
  };
  return (
    <div style={style.wrapper as React.CSSProperties} onClick={handleToggle}>
      <div style={style.btn as React.CSSProperties}></div>
    </div>
  );
};

export default ToggleBtn;
