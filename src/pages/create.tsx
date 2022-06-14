import { useEffect, useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { LanguageContext } from '../routes/authRoute';
import { daremeAction } from '../redux/actions/daremeActions';
import { fundmeAction } from '../redux/actions/fundmeActions';
import Title from '../components/general/title';
import Dialog from '../components/general/dialog';
import { CreatoCoinIcon, LightbulbIcon, SpreadIcon } from '../assets/svg';
import "../assets/styles/createStyle.scss";

const Create = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const contexts = useContext(LanguageContext);
    const prevRoute = useSelector((state: any) => state.load.prevRoute);
    const [openLinkSocial, setOpenLinkSocial] = useState(false);

    useEffect(() => { window.scrollTo(0, 0) }, []);

    const gotoDareMe = () => { dispatch(daremeAction.getDraftDareme(navigate)) }
    const gotoFundMe = () => { 
        setOpenLinkSocial(true);
        dispatch(fundmeAction.getDraftFundme(navigate));
    }

    return (
        <>
            <div className="title-header">
                <Title title="" back={() => navigate(prevRoute)} />
            </div>
            <Dialog
                display={openLinkSocial}
                wrapExit={() => { setOpenLinkSocial(false) }}
                title="Stay tuned..."
                icon={
                    {
                        pos: 0,
                        icon: <SpreadIcon color="#EFA058" width="50px" height="50px" />
                    }
                }
                context={'We will be launching this soon.'}
            />
            <div className="create-wrapper">
                <div className="create-card" onClick={gotoDareMe}>
                    <div className="card-icon">
                        <LightbulbIcon width="30px" height="42px" color="#EFA058" />
                    </div>
                    <div className="letter-part">
                        <div className="title-letter">
                            {contexts.CREATE_LETTER.DAREME_TITLE_LETTER}
                        </div>
                        <div className="body-letter">
                            {contexts.CREATE_LETTER.DAREME_BODY_LETTER}
                        </div>
                    </div>
                </div>
                <div className="create-card" onClick={gotoFundMe}>
                    <div className="card-icon">
                        <CreatoCoinIcon width="37px" height="37px" color="#EFA058" />
                    </div>
                    <div className="letter-part">
                        <div className="title-letter">
                            {contexts.CREATE_LETTER.FUNDME_TITLE_LETTER}
                        </div>
                        <div className="body-letter">
                            {contexts.CREATE_LETTER.FUNDME_BODY_LETTER}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Create;
