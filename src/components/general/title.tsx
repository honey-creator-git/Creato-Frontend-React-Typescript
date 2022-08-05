import React from "react";
import { useSelector } from "react-redux";
import { BackIcon, HelpIcon, EraseIcon, DeleteIcon, NoOfPeopleIcon } from "../../assets/svg";

const Title = (props: any) => {
  const { title, hint, back, erase, del, voters, ownerId } = props;
  const user = useSelector((state: any) => state.auth.user);

  const style = {
    titleWrapper: {
      width: "100%",
      padding: "14px 1px",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "20px",
      lineHeight: "24px",
      textAlign: "center",
      color: "#EFA058",
    },

  };

  return (
    <div style={style.titleWrapper as React.CSSProperties}>
      <div onClick={props.back} >
        {back === undefined ?
          <BackIcon color="" />
          : <BackIcon color="black" />
        }
      </div>
      <div style={style.title as React.CSSProperties}>{title}</div>
      <div style={{ display: 'flex' }}>
        <div onClick={props.erase} style={{ marginRight: '10px' }}>
          {erase ? <EraseIcon color="black" /> : ""}
        </div>
        <div onClick={props.hint}>
          {hint === undefined ?
            <>{del === true ? <DeleteIcon color="white" /> : <span>&nbsp;</span>}</>
            :
            <>{del === true ? <DeleteIcon color="#EFA058" /> : <HelpIcon />}</>
          }
        </div>
        {(voters !== undefined && (ownerId === user?.id || user?.role === "ADMIN")) &&
          <div onClick={props.voters}>
            <NoOfPeopleIcon color="#938D8A" />
          </div>
        }
      </div>
    </div>
  );
};

export default Title;
