import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Title from '../../../components/general/title'
import { referralAction } from '../../../redux/actions/referralActions'
import { CreatoCoinIcon, ProfileIcon } from '../../../assets/svg'
import '../../../assets/styles/admin/referral/adminReferralStyle.scss'

const ReferralLinkDetail = () => {
  const { userId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const referralState = useSelector((state: any) => state.referral)
  const referral = referralState.referralLink

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(referralAction.getReferralLinkDetail(userId))
  }, [location, userId, dispatch])

  return (
    <>
      <div className="admin-referral-wrapper">
        <Title title="Referral Links" back={() => { navigate('/admin/referral_links') }} />
        <div className="referral-data">
          <table className="data-table">
            <thead>
              <tr style={{ width: '100%' }}>
                <th style={{ width: '20%' }}>Username</th>
                <th style={{ width: '15%' }}>Date - link click</th>
                <th style={{ width: '15%' }}>Time - link click</th>
                <th style={{ width: '15%' }}>Sign up?</th>
                <th style={{ width: '20%' }}>New Sign-up Username</th>
                <th style={{ width: '15%' }}>Donuts earned</th>
              </tr>
            </thead>
            <tbody>
              {referral?.invitedUsers.map((user: any, index: any) => (
                <tr key={index}>
                  <td>
                    {index === 0 ?
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>{referral.user.name}</div>
                        <div className="receiver-profile" onClick={() => { navigate(`/${referral.user.personalisedUrl}`) }}>
                          <ProfileIcon color="#EFA058" />
                        </div>
                      </div> : <div></div>
                    }
                  </td>
                  <td>{new Date(user.date).toUTCString().slice(5, 16)}</td>
                  <td>{new Date(user.date).toUTCString().slice(17, 25)}</td>
                  <td>{user.newUser ? 'Yes' : 'No'}</td>
                  <td>{user.newUser &&
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>{user.newUser.name}</div>
                      <div className="receiver-profile" onClick={() => { navigate(`/${user.newUser.personalisedUrl}`) }}>
                        <ProfileIcon color="#EFA058" />
                      </div>
                    </div>
                  }
                  </td>
                  <td>
                    {user.newUser &&
                      <div className="donuts-type">
                        <CreatoCoinIcon color={user.earned ? "#10B981" : "#EFA058"} />
                        <span style={user.earned ? { color: '#10B981' } : { color: '#EFA058' }}>{user.reward}</span>
                      </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ReferralLinkDetail