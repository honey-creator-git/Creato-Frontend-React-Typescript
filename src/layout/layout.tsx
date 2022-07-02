
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import Footer from "./footer";
import Header from "./header";
import Loading from "../components/general/loading";
import { authAction } from "../redux/actions/authActions";
import "../assets/styles/layout/layoutStyle.scss";
import { useEffect, useState, useContext } from "react";
import Dialog from '../components/general/dialog';
import {LanguageContext} from '../../src/routes/authRoute';

const Layout = (props: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadState = useSelector((state: any) => state.load);
  const token: any = JSON.parse(localStorage.getItem('dareme_token') || '{}');

  const [openBrowser, setOpenBrowser] = useState(false);
  const contexts = useContext(LanguageContext);
  
  useEffect(() => {
    const linePattern = "line";
    const appInfo = window.navigator.userAgent.toLowerCase();
    console.log(appInfo.indexOf(linePattern))
    if (appInfo.indexOf(linePattern) !== -1) {
      setOpenBrowser(true);
    }
  }, []); 

  useEffect(() => {
    if (localStorage.getItem('dareme_token')) {
      const decoded: any = decode(token);
      if (decoded.exp * 1000 < new Date().getTime()) dispatch(authAction.logout(navigate));
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Dialog
        display={openBrowser && !loadState.loading}
        title={contexts.DIALOG.HEADER_TITLE.DIRECT_BROWSER_TITLE}
        context={contexts.DIALOG.BODY_LETTER.DIRECT_BROWSER_CONTENT}
        buttons={[
          {
            text: contexts.DIALOG.BUTTON_LETTER.DIRECT,
            handleClick: () => {
              let link = document.createElement('a');
              link.setAttribute("href", "intent:" + window.location.href + "#Intent;end");
              link.setAttribute("target", "_blank");
              link.click();
            }
          }
        ]}
      />
      <Loading loading={loadState.loading} />
      <Header />
      <div className="layout">{props.child}</div>
      <Footer />
    </>
  );
};

export default Layout;
