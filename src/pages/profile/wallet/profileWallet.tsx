import { useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { daremeAction } from "../../../redux/actions/daremeActions";
import {
  ArrowDownIcon,
  BalanceIcon,
  CreatoCoinIcon,
  MoneyIcon,
  MoreIcon,
  SpreadIcon,
  StripeIcon,
} from "../../../assets/svg";
import Dialog from "../../../components/general/dialog";
import Button from "../../../components/general/button";
import Title from "../../../components/general/title";
import ContainerBtn from "../../../components/general/containerBtn";
import { LanguageContext } from "../../../routes/authRoute";
import { SET_PREVIOUS_ROUTE, SET_TRANSACTIONS } from "../../../redux/types";
import { transactionActions } from "../../../redux/actions/transactionActions";
import "../../../assets/styles/profile/profileWalletStyle.scss";

const useOutsideAlerter = (ref: any, moreInfo: any) => {
  const [more, setMore] = useState(moreInfo);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      setMore(moreInfo);
      if (ref.current && !ref.current.contains(event.target)) {
        if (moreInfo) setMore(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, moreInfo]);
  return more;
}

const ProfileWallet = () => {
  const navigate = useNavigate();
  const userState = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const user = userState.user;
  const [openConnectStripe, setOpenConnectStripe] = useState(false);
  const transactions = useSelector((state: any) => state.transaction.transactions);
  const [moreInfo, setMoreInfo] = useState(false);
  const wrapRef = useRef<any>(null);
  const contexts = useContext(LanguageContext);
  const res = useOutsideAlerter(wrapRef, moreInfo);

  useEffect(() => {
    if (!res) setMoreInfo(res);
  }, [res]);

  const calcColor = (description: any, to: any) => {
    if (description === 2 || description === 3 || description === 4 || description === 7) return true;
    if (description === 9 && user.id === to) return true;
    else return false;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: SET_TRANSACTIONS, payload: [] });
    dispatch(transactionActions.getUserLatest5Transactions());
  }, [location]);

  return (
    <>
      <div className="title-header">
        <Title title={contexts.HEADER_TITLE.MY_DONUTS} back={() => { dispatch(daremeAction.getDaremesByPersonalisedUrl(user.personalisedUrl, navigate)); }} />
      </div>
      <div className="profile-wallet">
        <Dialog
          display={openConnectStripe}
          wrapExit={() => { setOpenConnectStripe(false); }}
          title="Stay tuned!"
          context={"We will be launching this\nfeature soon."}
          icon={{
            pos: 0,
            icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
          }}
        />
        <div className="donuts">
          <div className="total">
            <div className="title">{contexts.WALLET_LETTER.TOTAL_NUMBER}</div>
            <div className="content">
              <div className="part">
                <div className="icon">
                  <Button
                    color="primary"
                    icon={[
                      <BalanceIcon color="white" />,
                      <BalanceIcon color="white" />,
                      <BalanceIcon color="white" />,
                    ]}
                    shape="pill"
                    fillStyle="fill"
                    handleSubmit={() => { }}
                  />
                </div>
                <div className="number">{user && (user.wallet).toLocaleString()}</div>
              </div>
              <div className="btn">
                <Button
                  color="primary"
                  fillStyle="fill"
                  shape="rounded"
                  text={contexts.WALLET_LETTER.TOP_UP}
                  handleSubmit={() => {
                    dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${user.personalisedUrl}/wallet` });
                    navigate(`/${user.personalisedUrl}/shop`);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="cashable">
            <div className="title">{contexts.WALLET_LETTER.CASHABLE_DONUTS}</div>
            <div className="content">
              <div className="part">
                <div className="icon">
                  <Button
                    color="primary"
                    icon={[
                      <MoneyIcon color="white" />,
                      <MoneyIcon color="white" />,
                      <MoneyIcon color="white" />,
                    ]}
                    shape="pill"
                    fillStyle="fill"
                    handleSubmit={() => { }}
                  />
                </div>
                {user &&
                  <div className="number">
                    <div>{(user.wallet).toLocaleString()}</div>
                    <div><span>{`($${(user.wallet / 10.0).toLocaleString()}USD)`}</span></div>
                  </div>
                }
              </div>
              <div className="btn">
                <Button
                  color="primary"
                  fillStyle="outline"
                  shape="rounded"
                  text={contexts.WALLET_LETTER.CASH_OUT}
                  handleSubmit={() => {
                    window.open("https://www.creatogether.app/altpayout", '_blank');
                  }}
                />
              </div>
            </div>
          </div>
          <div className="bottom-btn" onClick={() => { navigate(`/users/${user.id}/setting/invitefriends`); }}>
            <ContainerBtn
              styleType="fill"
              text={contexts.WALLET_LETTER.INVITE_FRIENDS}
              icon={[
                <SpreadIcon color="white" />,
                <SpreadIcon color="white" />,
                <SpreadIcon color="white" />,
              ]}
            />
          </div>
        </div>
        <div className="transaction-history">
          <div className="header">
            <div className="coin-icon">
              <CreatoCoinIcon color="black" />
            </div>
            <div className="title">{contexts.WALLET_LETTER.DONUTS_HISTORY}</div>
            <div className="more-icon">
              <div onClick={() => { setMoreInfo(true) }}><MoreIcon color="black" /></div>
              <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
                <div className="list" onClick={() => {
                  setMoreInfo(false);
                  dispatch({ type: SET_TRANSACTIONS, payload: [] });
                  dispatch(transactionActions.getUserTransactionsByDays(30));
                  navigate(`/${user.personalisedUrl}/wallet/donuts-transactions`);
                }}>
                  {contexts.WALLET_LETTER.FIRST_DAYS}
                </div>
                <div className="list" onClick={() => {
                  setMoreInfo(false);
                  dispatch({ type: SET_TRANSACTIONS, payload: [] });
                  dispatch(transactionActions.getUserTransactionsByDays(60));
                  navigate(`/${user.personalisedUrl}/wallet/donuts-transactions`);
                }}>
                  {contexts.WALLET_LETTER.SECOND_DAYS}
                </div>
                <div className="list" onClick={() => {
                  setMoreInfo(false);
                  dispatch({ type: SET_TRANSACTIONS, payload: [] });
                  dispatch(transactionActions.getUserTransactionsByDays(0));
                  navigate(`/${user.personalisedUrl}/wallet/donuts-transactions`);
                }}>
                  {contexts.WALLET_LETTER.ALL_DAYS}
                </div>
              </div>
            </div>
          </div>
          <div className="history">
            <div className="header">
              <div className="col1">
                <div>{contexts.WALLET_LETTER.AMOUNT}</div>
                {/* <ArrowDownIcon color="black" /> */}
              </div>
              <div className="col2">
                <div>{contexts.WALLET_LETTER.DESCRIPTION}</div>
              </div>
              <div className="col3">
                <div>{contexts.WALLET_LETTER.DATE}</div>
                {/* <ArrowDownIcon color="black" /> */}
              </div>
            </div>
            <div className="body">
              {transactions.length > 0 &&
                transactions.map((transaction: any, index: any) => (
                  <div className="row" key={index}>
                    <div className="col1">
                      <CreatoCoinIcon color={calcColor(transaction?.description, transaction?.user1) ? "#27AE60" : "#AE0000"} />
                      <div style={calcColor(transaction?.description, transaction?.user1) ? { color: "#27AE60" } : { color: "#AE0000" }} >{transaction.description === 3 ? 0 : (transaction.donuts).toLocaleString()}</div>
                    </div>
                    <div className="col2">
                      <div>
                        {transaction.description === 2 && `Purchase - ${transaction.donuts} Donuts`}
                        {transaction.description === 3 && `Vote Donut x1`}
                        {transaction.description === 4 && "Earnings from DareMe"}
                        {transaction.description === 5 && "Vote as SuperFans"}
                        {transaction.description === 6 && "Dare Request"}
                        {transaction.description === 7 && "Donuts Refund"}
                        {(transaction.description === 9 || transaction.description === 8) && "Tipping Donuts"}
                        {transaction.description === 10 && "Unlock Exclusive Content"}
                      </div>
                    </div>
                    <div className="col3">
                      <div>{new Date(transaction?.date).toUTCString().slice(5, 11)}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="connect-strip-account">
          <div className="header">
            <StripeIcon />
            <div className="title">Connect Stripe account</div>
            <MoreIcon color="black" />
          </div>
          <div className="content">
            <div>Get paid direcly to local bank account</div>
            <div>No min. charge</div>
          </div>
          <div className="btn" onClick={() => {
            setOpenConnectStripe(true);
          }}>
            <ContainerBtn text={contexts.WALLET_LETTER.CONNECT} styleType="outline" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileWallet;
