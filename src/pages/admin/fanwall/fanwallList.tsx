import { useEffect, useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { fanwallAction } from "../../../redux/actions/fanwallActions"
import { SearchIcon } from "../../../assets/svg"
import { LanguageContext } from "../../../routes/authRoute"
import { SET_FANWALL, SET_FANWALL_VIDEOFILE } from "../../../redux/types"
import "../../../assets/styles/admin/dareme/adminDareMeListStyle.scss"

const FanwallList = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fanwalls = useSelector((state: any) => state.fanwall.fanwalls)
  const [search, setSearch] = useState('')
  const contexts = useContext(LanguageContext)

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(fanwallAction.getFanwallList())
  }, [location])

  return (
    <div className="admin-daremes-wrapper">
      <div className="search-bar">
        <SearchIcon color="#EFA058" />
        <input className="search-input" onChange={(e) => { setSearch(e.target.value) }} onKeyUp={(e) => {
          // if(e.keyCode === 13) dispatch(authAction.getUsersData(search)) 
        }} />
      </div>
      <div className="daremes-data">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Username</th>
              <th>Owner Category</th>
              <th>Type</th>
              <th style={{ paddingLeft: '18px' }}>Title</th>
              <th>Category</th>
              <th>Fanwall</th>
            </tr>
          </thead>
          <tbody>
            {fanwalls.map((fanwall: any, index: any) => (
              <tr key={index}>
                <td>{new Date(fanwall.date).toLocaleDateString()}</td>
                <td style={{ color: '#F2B176' }}>{fanwall?.owner?.name}</td>
                <td>
                  {fanwall?.owner?.categories.map((category: any, i: any, array: any) => (
                    <span key={i}>{contexts.CREATOR_CATEGORY_LIST[category]}{i !== array.length - 1 && "/"}</span>
                  ))}
                </td>
                <td>{fanwall?.type}</td>
                <td onClick={() => {
                  dispatch({
                    type: SET_FANWALL,
                    payload: {
                      fanwall: {
                        fundme: null,
                        dareme: null,
                        writer: null,
                        video: null,
                        embedUrl: null,
                        sizeType: null,
                        message: null,
                        cover: null,
                        posted: null
                      },
                      itemType: fanwall.type
                    }
                  })
                  dispatch({ type: SET_FANWALL_VIDEOFILE, payload: null })
                  if (fanwall?.fanwall) navigate('/admin/fanwalls/details/' + fanwall?.fanwall?._id)
                  else navigate('/admin/fanwalls/details/post/' + fanwall?.itemId + '?type=' + fanwall?.type)
                }}>
                  <div className="dareme-title">
                    {/* {!dareme.show && <HiddenIcon color="#efa058" />} */}
                    <div style={/*dareme.show ? { marginLeft: '26px' } : */{ marginLeft: '2px' }} >
                      {fanwall?.title}
                    </div>
                  </div>
                </td>
                <td>
                  {fanwall?.type === 'DareMe' && contexts.DAREME_CATEGORY_LIST[fanwall?.category - 1]}
                  {fanwall?.type === 'FundMe' && contexts.FUNDME_CATEGORY_LIST[fanwall?.category - 1]}
                </td>
                <td>
                  {fanwall?.fanwall && 'Posted'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FanwallList