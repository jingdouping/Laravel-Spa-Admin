import Sidebar from "../../components/sidebar/Sidebar";
import "./newCategory.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginaxios } from "../../../app";

export default function NewSecondCategory(props) {
  const navigate = useNavigate()

  const [secondaryCategory,setSecondaryCategory] = useState({
    secondary_category_name:'',
  })

  const [category,setCategory] = useState({
    secondary_category_name:'',
    primary_category_name:[],
    error_list:[],
  })

  useEffect(()=>{
    loginaxios.get('/api/view-firstcategory').then(res => {
      if(res.data.status === 200){
        // setPrimaryCategory(res.data.primary_category)
        setCategory({...category,primary_category_name:res.data.primary_category})
      }else if(res.data.status === 400){
        setSecondaryCategory({...secondaryCategory,error_list:res.data.errors})
      }
    });
  },[])

  const handleInput = (e) => {
    // e.persist();
    setCategory({...category,[e.target.name]:e.target.value})
  }

  const submitCategory = (e) => {
    e.preventDefault()
    loginaxios.post('/api/store-secondcategory',category).then(res => {
      if(res.data.status === 200){
        document.getElementById('CATEGORY_FORM').reset();
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        navigate('/secondcategories')
      }else if(res.data.status === 400){
        setCategory({...category,error_list:res.data.errors})
      }
    });
  }

  return (
    <div className='new'>
      <Sidebar/>
      <div className='newContainer'>
        <div className='top'>
          <h1>{props.title}</h1>
        </div>
        <div className='bottom'>

          <div className='right'>
            <form onSubmit={submitCategory} id='CATEGORY_FORM'>
            <div className='formInput'>
            <label>第一カテゴリー</label>
                <select name='primary_category_id' value={category.primary_category_name.primary_category_id} className='selectcategory' onChange={handleInput}>
                  <option>第一カテゴリーの選択</option>
                  {category.primary_category_name.map((item)=>{
                    return (
                      <option value={item.id} key={item.id}>{item.primary_category_name}</option>
                    )
                  })}
                </select>
                <small style={{color:'red'}}>{category.error_list.primary_category_id}</small>
            </div>
              <div className='formInput'>
                <label>第二カテゴリー</label>
                <input type='text' placeholder='第二カテゴリー' name='secondary_category_name' onChange={handleInput}/>
                <small style={{color:'red'}}>{category.error_list.secondary_category_name}</small>
              </div>
              <button style={{height:'35px',marginTop:'auto'}}>送信</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
