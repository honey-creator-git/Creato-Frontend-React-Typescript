import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Title from "../../../components/general/title";
import { CreatoCoinIcon } from "../../../assets/svg";
import '../../../assets/styles/profile/balanceStyle.scss';

const Balance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: any) => state.auth.user);
  const transactions = useSelector((state: any) => state.transaction.transactions);
  const calcColor = (description: any) => {
    if (description === 2 || description === 3 || description === 4 || description === 7) return true;
    else return false;
  }
  
  let total = 0;
  transactions.forEach((transaction: any) => { 
    if(calcColor(transaction.description)) total += transaction.donuts ;
    else total -= transaction.donuts;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <div className="title-header">
        <Title title="Balance History" back={() => navigate(`/${user.personalisedUrl}/wallet`)} />
      </div>
      <div className="balance-wrapper">
        <div className="table">
          <div className="header">
            <div className="row">
              <div className="col1">Amount</div>
              <div className="col2">Description</div>
              <div className="col3">Date</div>
            </div>
          </div>
          <div className="body">
            {transactions.length > 0 &&
              transactions.map((transaction: any, index: any) => (
                <div className="row" key={index}>
                  <div className="col1">
                    <CreatoCoinIcon color={calcColor(transaction?.description) ? "#27AE60" : "#AE0000"} />
                    <div style={calcColor(transaction?.description) ? { color: "#27AE60" } : { color: "#AE0000" }} >{transaction.description === 3 ? 0 : (transaction.donuts).toLocaleString()}</div>
                  </div>
                  <div className="col2">
                    <div>
                      {transaction.description === 2 && `Purchase - ${transaction.donuts} Donuts`}
                      {transaction.description === 3 && `Vote Donut x1`}
                      {transaction.description === 4 && "Earnings from DareMe"}
                      {transaction.description === 5 && "Vote as SuperFans"}
                      {transaction.description === 6 && "Dare Request"}
                      {transaction.description === 7 && "Donuts Refund"}
                    </div>
                  </div>
                  <div className="col3">
                    <div>{new Date(transaction?.date).toUTCString().slice(5, 11)}</div>
                  </div>
                </div>
              ))
            }
            <div className="row">
              <div className="col1">
                <CreatoCoinIcon color={total >= 0 ? "#27AE60" : "#AE0000"} />
                <div style={total >= 0 ? { color: "#27AE60" } : { color: "#AE0000" }} >{total}</div>
              </div>
              <div className="col2">Total earning</div>
              <div className="col3"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Balance;