import { useContext, useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import CategoryBtn from "../../components/general/categoryBtn"
import Title from "../../components/general/title"
import Creator from "../../components/profile/creator"
import { LanguageContext } from "../../routes/authRoute"
import { authAction } from "../../redux/actions/authActions"
import '../../assets/styles/profile/creatorListStyle.scss'

const Creators = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const contexts = useContext(LanguageContext)
  const [categories, setCategories] = useState<Array<any>>([])
  const users = useSelector((state: any) => state.auth.users)

  const selectCategory = (index: any) => {
    var array = [...categories];
    if (includeCategory(index)) {
      let i = categories.findIndex((category: any) => category === index)
      array.splice(i, 1);
    } else array.push(index);
    setCategories(array);
  }

  const includeCategory = (index: any) => {
    if (categories.findIndex((category: any) => category === index) !== -1) return true
    return false
  }

  useEffect(() => { dispatch(authAction.getCreatorsByCategory(categories)) }, [categories])

  useEffect(() => { window.scrollTo(0, 0) }, [location])

  return (
    <>
      <div className="title-header">
        <Title title={'List of Creators'} back={() => { navigate(`/`) }} />
      </div>
      <div className="creator-wrapper">
        <div className="sort-item">
          <div className="sort-letter">Sort by:</div>
          {contexts.CREATOR_CATEGORY_LIST.map((category: any, index: any) => (
            <div className="item" key={index} onClick={() => { selectCategory(index) }}>
              <CategoryBtn text={category} pressed={includeCategory(index) ? true : false} />
            </div>
          ))}
        </div>
        <div className="creators">
          {users.map((user: any, index: any) => (
            <div className="creator" key={index}>
              <Creator user={user} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Creators