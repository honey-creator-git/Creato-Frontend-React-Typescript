import { ArrowDownIcon } from "../assets/svg";

interface inputDropDownProps {
  size: string; // small big
  title: string;
  lists: HTMLElement[];
}

const InputDropDown = (props: inputDropDownProps) => {
  const style = {
    wrapper: {},
    title: {},
    icon: {},
    lists: {},
    list: {},
  };
  return (
    <div style={style.wrapper}>
      <div style={style.title}>{props.title}</div>
      <div style={style.icon}>
        <ArrowDownIcon color="black" />
      </div>
      <div style={style.lists}>
        {props.lists.map((list, i) => (
          <div style={style.list}>{list}</div>
        ))}
      </div>
    </div>
  );
};

export default InputDropDown;
