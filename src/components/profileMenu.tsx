const ProfileMenu = (props: any) => {
  const style = {
    profileMenu: {
      display: "flex",
      flexDirection: "row" as const,
      justifyContent: "space-between",
      background: "#FFFFFF",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
      borderRadius: "10px",
      padding: "10px 55px",
    },
    dareme: {
      color: props.menu === "dareme" ? "#EFA058" : "#D6D5CC",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      lineHeight: "20px",
      cursor: "pointer",
    },
    fundme: {
      color: props.menu === "fundme" ? "#EFA058" : "#D6D5CC",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      lineHeight: "20px",
      cursor: "pointer",
    },

    fanWall: {
      color: props.menu === "dareme" ? "#D6D5CC" : "#EFA058",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "18px",
      lineHeight: "20px",
      cursor: "pointer",
    },
  };
  return (
    <div style={style.profileMenu}>
      <div style={style.dareme} onClick={() => props.setViewType(0)}>
        DareMe & FundMe
      </div>
      <div style={style.fanWall} onClick={() => props.setViewType(1)}>
        Fan Wall
      </div>
    </div>
  );
};

export default ProfileMenu;
