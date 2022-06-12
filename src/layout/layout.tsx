import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import Footer from "./footer";
import Header from "./header";
import Loading from "../components/general/loading";
import { authAction } from "../redux/actions/authActions";
import "../assets/styles/layout/layoutStyle.scss";

const Layout = (props: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadState = useSelector((state: any) => state.load);
  const token: any = JSON.parse(localStorage.getItem('dareme_token') || '{}');

  useEffect(() => {
    if (localStorage.getItem('dareme_token')) {
      const decoded: any = decode(token);
      if (decoded.exp * 1000 < new Date().getTime()) dispatch(authAction.logout(navigate));
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Loading loading={loadState.loading} />
      <Header />
      <div className="layout">{props.child}</div>
      <Footer />
    </>
  );
};

export default Layout;
