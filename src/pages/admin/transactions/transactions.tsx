import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { transactionActions } from '../../../redux/actions/transactionActions';
import Button from '../../../components/general/button';
import TransferDialog from '../../../components/admin/transferDialog';
import Avatar from '../../../components/general/avatar';
import { AddIcon, CreatoCoinIcon, TopUpIcon, SearchIcon } from '../../../assets/svg';
import CONSTANT from '../../../constants/constant';
import visitorImg from "../../../assets/img/visitor_avatar.png";
import '../../../assets/styles/admin/transactions/adminTransactionsStyle.scss';

const AdminTransactions = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const transactions = useSelector((state: any) => state.transaction);
    const transactionList = transactions.transactions;
    const [type, setType] = useState(0);
    const [moreInfo, setMoreInfo] = useState(false);
    const [openAddDonuts, setOpenAddDonuts] = useState(false);
    const [openTransferDonuts, setOpenTransferDonuts] = useState(false);
    const [amount, setAmount] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const getTransactionData = (type: any) => {
        setType(type);
        dispatch(transactionActions.getAdminTransactions(type));
    }

    const calcColor = (type: any, description: any) => {
        if (type === 0) {
            if (description === 1 || description === 4 || description === 5) return true;
            else return false;
        } else if (type === 1) {
            if (description === 2 || description === 4 || description === 7) return true;
            else return false;
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        setType(0);
        dispatch(transactionActions.getAdminTransactions(type));
    }, [location]);

    return (
        <>
            <TransferDialog
                display={openAddDonuts}
                title="Donuts Control"
                type="add"
                setAmount={setAmount}
                amount={amount}
                exit={() => { setOpenAddDonuts(false); }}
                wrapExit={() => { setOpenAddDonuts(false); }}
                buttons={[
                    {
                        text: 'Cancel',
                        handleClick: () => { setOpenAddDonuts(false); }
                    },
                    {
                        text: "Confirm",
                        handleClick: () => {
                            setOpenAddDonuts(false);
                            dispatch(transactionActions.addAdminDonuts(amount));
                        }
                    }
                ]}
            />
            <TransferDialog
                display={openTransferDonuts}
                title="Transfer"
                type="transfer"
                setAmount={setAmount}
                amount={amount}
                setFrom={setFrom}
                from={from}
                setTo={setTo}
                to={to}
                exit={() => { setOpenTransferDonuts(false); }}
                wrapExit={() => { setOpenTransferDonuts(false); }}
                buttons={[
                    {
                        text: 'Cancel',
                        handleClick: () => { setOpenTransferDonuts(false); }
                    },
                    {
                        text: "Confirm",
                        handleClick: () => {
                            if (from !== to) {
                                setOpenTransferDonuts(false);
                                dispatch(transactionActions.transferDonuts(from, to, amount, type));
                            }
                        }
                    }
                ]}
            />
            <div className="admin-transactions-wrapper" onClick={() => { if (moreInfo) setMoreInfo(false); }}>
                <div className="transactions-header">
                    <div className="transactions-type">
                        <div className="type-button">
                            <Button
                                text="Admin"
                                fillStyle={type === 0 ? "fill" : "outline"}
                                color="primary"
                                shape="rounded"
                                handleSubmit={() => { getTransactionData(0); }}
                            />
                        </div>
                        <div className="type-button">
                            <Button
                                text="User"
                                fillStyle={type === 1 ? "fill" : "outline"}
                                color="primary"
                                shape="rounded"
                                handleSubmit={() => { getTransactionData(1); }}
                            />
                        </div>
                        <div className="type-button">
                            <Button
                                text="DareMe Wallet"
                                fillStyle={type === 2 ? "fill" : "outline"}
                                color="primary"
                                shape="rounded"
                                handleSubmit={() => { getTransactionData(2); }}
                            />
                        </div>
                    </div>
                    <div className="transactions-donuts">
                        <div className="donuts-type">
                            Total Donuts Circulating: {transactions.adminDonuts ? (transactions.adminDonuts + transactions.userDonuts + transactions.daremeDonuts).toLocaleString() : 0}
                        </div>
                        <div className="donuts-type">
                            Admin: {transactions.adminDonuts ? transactions.adminDonuts.toLocaleString() : 0}
                        </div>
                        <div className="donuts-type">
                            Users: {transactions.userDonuts ? transactions.userDonuts.toLocaleString() : 0}
                        </div>
                        <div className="donuts-type">
                            DareMe: {transactions.daremeDonuts ? transactions.daremeDonuts.toLocaleString() : 0}
                        </div>
                        <div className="donuts-type">
                            FundMe: {transactions.fundmeDonuts ? transactions.fundmeDonuts.toLocaleString() : 0}
                        </div>
                        <div className="donuts-control">
                            <Button
                                fillStyle="fill"
                                color="primary"
                                icon={[
                                    <AddIcon color="white" />,
                                    <AddIcon color="white" />,
                                    <AddIcon color="white" />
                                ]}
                                handleSubmit={() => {
                                    if (moreInfo === false) setMoreInfo(true);
                                }}
                            />
                            <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}}
                                onClick={(e) => { e.stopPropagation(); }}
                            >
                                <div className="list" onClick={() => {
                                    setMoreInfo(false);
                                    setAmount("");
                                    setOpenAddDonuts(true);
                                }}>
                                    <CreatoCoinIcon color="black" />&nbsp;&nbsp;&nbsp;Add Donuts
                                </div>
                                <div className="list" onClick={() => {
                                    setMoreInfo(false);
                                    setAmount("");
                                    setFrom("");
                                    setTo("");
                                    setOpenTransferDonuts(true);
                                }}>
                                    <TopUpIcon color="black" />&nbsp;&nbsp;&nbsp;Transfer
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="search-bar">
                    <SearchIcon color="#EFA058" />
                    <input className="search-input"
                    // onChange={(e) => { setSearch(e.target.value) }} onKeyUp={(e) => { if (e.keyCode === 13) dispatch(authAction.getUsersList(search)) }} 
                    />
                </div>
                <div className="users-data">
                    <table className="data-table">
                        {(type === 0 || type === 1) &&
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    {type === 1 &&
                                        <th>Username</th>
                                    }
                                    <th>Description</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Donuts</th>
                                    <th>In USD</th>
                                </tr>
                            </thead>
                        }
                        {(type === 0 || type === 1) && transactionList.length > 0 &&
                            <tbody>
                                {transactionList.map((transaction: any, index: any) => (
                                    <tr key={index}>
                                        <td>{new Date(transaction?.date).toUTCString().slice(5, 11)} {new Date(transaction?.date).toUTCString().slice(14, 16)}</td>
                                        <td>{new Date(transaction?.date).toUTCString().slice(17, 25)}</td>
                                        {type === 1 &&
                                            <td>
                                                <div>
                                                    <Avatar
                                                        avatar={
                                                            transaction?.user ?
                                                                transaction?.user?.avatar.indexOf('uploads') !== -1 ?
                                                                    `${CONSTANT.SERVER_URL}/${transaction?.user?.avatar}` :
                                                                    transaction?.user?.avatar : visitorImg}
                                                        username={transaction?.user ? transaction?.user.name : transaction?.nickname}
                                                        avatarStyle="horizontal"
                                                    />
                                                </div>
                                            </td>
                                        }
                                        <td>
                                            {transaction.description === 1 && "Added Donuts"}
                                            {transaction.description === 2 && `Purchase - ${transaction.donuts} Donuts`}
                                            {transaction.description === 3 &&
                                                <>
                                                    {type === 0 && `${transaction.dareme ? transaction.dareme.title : transaction.fundme ? transaction.fundme.title : ''} - Donut x1`}
                                                    {type === 1 && `Vote Donut x1 for Free`}
                                                </>
                                            }
                                            {transaction.description === 4 && <>Earnings from <strong>{transaction.from === "DAREME" && transaction.dareme ? transaction.dareme.title : ''}{transaction.from = "FUNDME" && transaction.fundme ? transaction.fundme.title : ''}</strong></>}
                                            {transaction.description === 5 && "Vote as SuperFans"}
                                            {transaction.description === 6 && (transaction.dareme ? "Dare Request" : "")}
                                            {transaction.description === 7 && <>Refund of Donuts in <strong>{transaction.dareme ? transaction.dareme.title : ""}</strong></>}
                                            {transaction.description === 8 && <>Tipping Donuts</>}
                                            {transaction.description === 9 && <>Tipping Donuts</>}
                                        </td>
                                        <td>
                                            {transaction.from === "ADMIN" && "Admin"}
                                            {transaction.from === "USER" &&
                                                <>{transaction.nickname ? transaction.nickname : transaction.user ? transaction.user.name : ''}</>
                                            }
                                            {transaction.from === "" && (transaction.dareme ? transaction.dareme.title : '')}
                                            {transaction.from === "FUNDME" && (transaction.fundme ? transaction.fundme.title : '')}
                                        </td>
                                        <td>
                                            {transaction.to === "ADMIN" && "Admin"}
                                            {transaction.to === "USER" &&
                                                <>{transaction.description === 9 ?
                                                    transaction.user1 ? transaction.user1.name : ''
                                                    : transaction.user ? transaction.user.name : ''
                                                }</>
                                            }
                                            {transaction.to === "DAREME" && (transaction.dareme ? transaction.dareme.title : '')}
                                            {transaction.to === "FUNDME" && (transaction.fundme ? transaction.fundme.title : '')}
                                        </td>
                                        <td>
                                            <div className="donuts-type">
                                                <CreatoCoinIcon color={calcColor(type, transaction.description) ? "#27AE60" : "#AE0000"} />
                                                <span style={calcColor(type, transaction.description) ? { color: '#27AE60' } : { color: '#AE0000' }}>
                                                    {(transaction.donuts || 0).toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {transaction.description === 2 && transaction.donuts / 10}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminTransactions;