import { useNavigate } from "react-router-dom";
import { CreatoCoinIcon } from "../../../assets/svg";
import Title from "../../../components/general/title";
import "../../../assets/styles/profile/earningStyle.scss";

const lists = [
  {
    amount: 500,
    description: "Someone dared you",
    date: "17 Nov",
  },
  {
    amount: 260,
    description: "Someone dared you",
    date: "1 Nov",
  },
  {
    amount: 230,
    description: "Someone dared you",
    date: "1 Jan",
  },
  {
    amount: 1000,
    description: "Someone dared you",
    date: "17 Dec",
  },
  {
    amount: 100,
    description: "Someone dared you",
    date: "19 Mar",
  },
  {
    amount: 700,
    description: "Someone dared you",
    date: "21 Jul",
  },
  {
    amount: 600,
    description: "Someone dared you",
    date: "17 Nov",
  },
  {
    amount: 500,
    description: "Someone voted or you",
    date: "17 Nov",
  },
  {
    amount: 500,
    description: "Someone voted or you",
    date: "17 Nov",
  },
  {
    amount: 500,
    description: "Someone voted or you",
    date: "17 Nov",
  },
  {
    amount: 500,
    description: "Creato’s admin fee",
    date: "17 Nov",
  },
];

const Earning = () => {
  const navigate = useNavigate();
  let total = 0;
  lists.map((list) => (total += list.amount));
  return (
    <div className="wallet-earning">
      <Title title="Earning from DareMe" back={()=>navigate("/profile/wallet")}/>
      <div className="table">
        <div className="header">
          <div className="row">
            <div className="col1">Amount</div>
            <div className="col2">Description</div>
            <div className="col3">Date</div>
          </div>
        </div>
        <div className="body">
          {lists.map((list, i) => (
            <div className="row">
              <div className="col1">
                <CreatoCoinIcon color="#27AE60" />
                <div>{list.amount}</div>
              </div>
              <div className="col2">{list.description}</div>
              <div className="col3">{list.date}</div>
            </div>
          ))}
          <div className="row">
            <div className="col1">
              <CreatoCoinIcon color="#27AE60" />
              <div>{total}</div>
            </div>
            <div className="col2">Total earning</div>
            <div className="col3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earning;
