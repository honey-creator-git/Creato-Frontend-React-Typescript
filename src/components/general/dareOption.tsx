import { useState } from "react"
import { CreatoCoinIcon, Dare1Icon, NoOfPeopleIcon, EditIcon } from "../../assets/svg"

const DareOption = (props: any) => {
  const { leading, donuts, canVote, username, dareTitle, disabled, voters, type } = props
  const [state, setState] = useState("default")

  const optionBackgroundColor =
    leading === true
      ? "radial-gradient(circle, rgba(251,164,63,0.9) 20%, rgba(252,70,70,0.8) 100%)"
      : "#F5F5F4"
  const optionHoverBackgroundColor = leading === true ? "#E88C95" : "#F5C395"
  const optionPressedBackgroundColor =
    leading === true ? "#DE5A67" : "#EFA058"

  const fontColor = leading === true ? "white" : "#54504E"
  const fontHoverColor = leading === true ? "white" : "white"
  const fontPressedColor = leading === true ? "white" : "white"
  const wrapper = {
    cursor: disabled === false ? "pointer" : "not-allowed",
    width: "100%",
    maxHeight: "104px",
    display: "flex",
    fontFamily: "Lato",
    flexDirection: "column" as const,
  }

  const option = {
    height: "42px",
    padding: "20px",
    borderRadius: "10px",
    background:
      state === "hover"
        ? optionHoverBackgroundColor
        : state === "pressed"
          ? optionPressedBackgroundColor
          : optionBackgroundColor,
    display: "flex",
    justifyContent: "space-between",
  }

  const disableOption = {
    height: "42px",
    padding: "20px",
    borderRadius: "10px",
    background: "#E1E0DF",
    color: "#938D8A",
    display: "flex",
    justifyContent: "space-between",
  }

  const optionFontStyle = {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color:
      disabled === true
        ? "#938D8A"
        : state === "default"
          ? fontColor
          : state === "hover"
            ? fontHoverColor
            : fontPressedColor,
  }

  const iconStyle = {
    display: "flex",
    alignItems: "center",
  }

  const voteStyle = {
    height: "24px",
    display: "flex",
    padding: "0",
    justifyContent: "space-between",
  }

  const resultStyle = {
    display: "flex",
    alignItems: "center",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "12px",
    lineHeight: "14px",
    color: "#000000",
  }

  const optionStyle = disabled === false ? option : disableOption

  return (
    <div
      style={wrapper}
      onMouseOver={() => setState("hover")}
      onMouseLeave={() => setState("default")}
      onMouseDown={() => setState("pressed")}
      onClick={() => { props.handleSubmit() }}
    >
      <div style={optionStyle}>
        <div style={optionFontStyle}>{dareTitle}</div>
        {type ?
          <div style={iconStyle}>
            <EditIcon color={state === "default" ? "#EFA058" : "white"} />
          </div>
          :
          <>
            {canVote === true && (
              <div style={iconStyle}>
                {disabled === true ? (
                  <Dare1Icon color="#938D8A" />
                ) : state === "default" && leading === false ? (
                  <Dare1Icon color="#EFA058" />
                ) : (
                  <Dare1Icon color="white" />
                )}
              </div>
            )}
          </>
        }
      </div>
      <div style={voteStyle}>
        <div style={resultStyle}>
          {(voters !== undefined) && (
            <>
              <CreatoCoinIcon color="#54504E" />
              <div
                style={{
                  padding: "0px 5px",
                  width: "fit-content",
                  textAlign: "left" as const,
                  fontSize: '12px',
                }}
              >
                {donuts.toLocaleString()}
              </div>
              <NoOfPeopleIcon color="#54504E" />
              <div
                style={{
                  padding: "0px 5px",
                  width: "fit-content",
                  textAlign: "center" as const,
                }}
              >
                {voters.toLocaleString()}
              </div>
            </>
          )}
        </div>
        <div
          style={{
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "10px",
            lineHeight: "12px",
            letterSpacing: "0.005em",
            color: "#54504E",
            display: "flex",
            alignItems: "center",
          }}
        >
          by {username}
        </div>
      </div>
    </div>
  )
}

export default DareOption
