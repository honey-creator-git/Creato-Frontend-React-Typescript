import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../../components/general/button'
import Title from '../../../components/general/title'
import Input from '../../../components/general/input'
import Dialog from '../../../components/general/dialog'
import { referralAction } from '../../../redux/actions/referralActions'
import { CreatoCoinIcon, MoreIcon, ProfileIcon, TopUpIcon } from '../../../assets/svg'
import '../../../assets/styles/admin/referral/adminReferralStyle.scss'

const ReferralLinks = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [reward, setReward] = useState('')
  const referralState = useSelector((state: any) => state.referral)
  const referrals = referralState.referralLinks
  const referralReward = referralState.reward
  const [donuts, SetDonuts] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [openTransferModal, setOpenTransferModal] = useState(false)
  const [openSaveRewardModal, setOpenSaveRewardModal] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(referralAction.getReferralLinks())
  }, [location, dispatch])

  useEffect(() => {
    if (referralReward) setReward(referralReward)
  }, [referralReward])

  return (
    <>
      <div className="admin-referral-wrapper">
        <Title title="Referral Links" />
        <div className="number-of-donuts">
          <Dialog
            display={openSaveRewardModal}
            exit={() => { setOpenSaveRewardModal(false) }}
            wrapExit={() => { setOpenSaveRewardModal(false) }}
            title="Confirm"
            context={`Are you sure to change the rewards to ${reward} donuts`}
            buttons={[
              {
                text: 'No',
                handleClick: () => { setOpenSaveRewardModal(false) }
              },
              {
                text: 'Yes',
                handleClick: () => {
                  dispatch(referralAction.changeRewardDonuts(Number(reward)))
                  setOpenSaveRewardModal(false)
                }
              }
            ]}
          />
          <Dialog
            display={openTransferModal}
            exit={() => { setOpenTransferModal(false) }}
            wrapExit={() => { setOpenTransferModal(false) }}
            title="Confirm"
            context={`Are you sure to send ${donuts} Donuts to ${user?.name}`}
            buttons={[
              {
                text: 'No',
                handleClick: () => { setOpenTransferModal(false) }
              },
              {
                text: 'Yes',
                handleClick: () => {
                  setOpenTransferModal(false)
                  dispatch(referralAction.transferDonuts(donuts, user._id))
                }
              }
            ]}
          />
          <div className="input-reward">
            <div className="letter">
              <span>Number of Donuts for reward</span>
            </div>
            <div className="input-box">
              <Input
                title={reward}
                setTitle={setReward}
                isNumber={true}
                type="input"
                width={200}
                minnum={0}
                maxnum={1000000000}
                step={1}
                placeholder="Number of donuts"
              />
            </div>
            <div className="save-btn">
              <Button
                text="Save"
                shape="rounded"
                fillStyle="fill"
                color="primary"
                handleSubmit={() => { setOpenSaveRewardModal(true) }}
              />
            </div>
          </div>
          <div className="letter">
            <span>Current Reward: {referralReward}</span>
          </div>
        </div>
        <div className="referral-data">
          <table className="data-table">
            <thead>
              <tr style={{ width: '100%' }}>
                <th style={{ width: '15%' }}>Username</th>
                <th style={{ width: '12%' }}>No.of link clicks</th>
                <th style={{ width: '12%' }}>No.of new sign up</th>
                <th style={{ width: '12%' }}>Conversion rate</th>
                <th style={{ width: '12%' }}>Total expected earnings</th>
                <th style={{ width: '12%' }}>Earned donuts (not yet transferred to user)</th>
                <th style={{ width: '12%' }}>Donuts sent</th>
                <th style={{ width: '11%' }}>See more</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((referral: any, index: any) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>{referral.user.name}</div>
                      <div className="receiver-profile" onClick={() => { navigate(`/${referral.user.personalisedUrl}`) }}>
                        <ProfileIcon color="#EFA058" />
                      </div>
                    </div>
                  </td>
                  <td>{referral.invitedUsers.length}</td>
                  <td>{referral.invitedUsers.filter((user: any) => user.newUser).length}</td>
                  <td>{Math.round(referral.invitedUsers.filter((user: any) => user.newUser).length / referral.invitedUsers.length * 100)}%</td>
                  <td>
                    <div className="donuts-type">
                      <CreatoCoinIcon color="black" />
                      <span style={{ color: 'black' }}>{referral.expected}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="donuts-type">
                        <CreatoCoinIcon color={referral.expected - referral.earned > 0 ? "#EFA058" : "#BAB6B5"} />
                        <span style={referral.expected - referral.earned > 0 ? { color: '#EFA058' } : { color: '#BAB6B5' }}>
                          {referral.expected - referral.earned}
                        </span>
                      </div>
                      {(referral.expected - referral.earned) > 0 ?
                        <div className="top-up" onClick={() => {
                          setUser(referral.user)
                          SetDonuts(referral.expected - referral.earned)
                          setOpenTransferModal(true)
                        }}><TopUpIcon color={"#EFA058"} /></div>
                        : <div><TopUpIcon color={"#BAB6B5"} /></div>
                      }
                    </div>
                  </td>
                  <td>
                    <div className="donuts-type">
                      <CreatoCoinIcon color="#10B981" />
                      <span style={{ color: '#10B981' }}>{referral.earned}</span>
                    </div>
                  </td>
                  <td>
                    <div className="receiver-profile" style={{ marginRight: 'auto', marginLeft: 'auto' }} onClick={() => { navigate(`/admin/referral_links/${referral.user._id}`) }}>
                      <MoreIcon color="#EFA058" />
                    </div>
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

export default ReferralLinks