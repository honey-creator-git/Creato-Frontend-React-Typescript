import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { LanguageContext } from "../../../routes/authRoute";
import { useSelector } from 'react-redux';
import { SET_PROFILE_DATA } from '../../../redux/types';
import CategoryBtn from "../../../components/general/categoryBtn";
import Button from '../../../components/general/button';
import Title from "../../../components/general/title";
import "../../../assets/styles/profile/categoriesStyle.scss";

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contexts = useContext(LanguageContext);
  const authState = useSelector((state: any) => state.auth);
  const profile = authState.profileData;
  const [categories, setCategories] = useState<Array<any>>([]);

  const selectCategory = (index: any) => {
    var array = [...categories];
    if (includeCategory(index)) {
      let array_index = 0;
      for (let i = 0; i < categories.length; i++) if (categories[i] === index) array_index = i;
      array.splice(array_index, 1);
    } else {
      if (array.length < 3) array.push(index);
    }
    setCategories(array);
  }

  const handleSave = () => {
    const state = { ...profile, category: categories }
    dispatch({ type: SET_PROFILE_DATA, payload: state });
    navigate(`/users/${authState.user?.id}/edit`);
  }

  const includeCategory = (index: any) => {
    for (let i = 0; i < categories.length; i++) if (categories[i] === index) return true;
    return false;
  }

  useEffect(() => {
    if (authState.user) {
      if(profile.category.length) setCategories(profile.category);
      else setCategories(authState.user.category);
    }
  }, [authState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="title-header">
        <Title title="Choose categories" back={() => navigate(`/users/${authState.user?.id}/edit`)} />
      </div>
      <div className="categories-wrapper">
        <div className="description">
          Please select Categories of your content, choosing a maximum 3
          categories will increase search rate & create more accurate suggestions.
        </div>
        <div className="categories">
          {contexts.CREATOR_CATEGORY_LIST.map((title: any, i: any) => (
            <div className="category" key={i} onClick={() => { selectCategory(i); }}>
              <CategoryBtn text={title} color="primary" pressed={includeCategory(i) ? true : false} />
            </div>
          ))}
        </div>
        <div className="save-btn">
          <Button
            fillStyle="fill"
            text="Save"
            color="primary"
            shape="rounded"
            width="100px"
            handleSubmit={handleSave}
          />
        </div>
      </div>
    </>
  );
};

export default Categories;
