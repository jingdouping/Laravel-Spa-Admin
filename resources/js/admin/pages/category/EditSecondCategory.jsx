import Sidebar from "../../components/sidebar/Sidebar";
import "./newCategory.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { loginaxios } from "../../../app";

export default function EditSecondCategory(props) {
  const navigate = useNavigate()

  const [category,setCategory] = useState({
    primary_category_id:'',
    secondary_category_name:'',
    error_list:[],
  })

  const [categoryList,setCategoryList] = useState({
    secondary_category_name:[],
    primary_category_id:[],
  })

  let {categoryid} = useParams();
  useEffect(()=>{
    loginaxios.get(`/api/edit-secondcategory/${categoryid}`).then(res=>{
      if(res.data.status === 200){
        setCategoryList({...categoryList,secondary_category_name:res.data.secondary_category,primary_category_id:res.data.primary_category});

        setCategory({...category,primary_category_id:res.data.secondary_category[0].primary_category_id,secondary_category_name:res.data.secondary_category[0].secondary_category_name});
      }else if(res.data.status == 404){

      }
    });

  },[])

  const handleInput = (e) => {
    // e.persist();
    setCategory({...category,[e.target.name]:e.target.value})
  }

  const updateCategory = (e) => {
    e.preventDefault()
    loginaxios.post(`/api/update-secondcategory/${categoryid}`,category).then(res => {
      if(res.data.status === 200){
        // document.getElementById('CATEGORY_FORM').reset();
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        navigate('/secondcategories')
      }else if(res.data.status === 422){
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

            <form onSubmit={updateCategory} id='CATEGORY_FORM'>
              <div className='formInput'>
              <label>第一カテゴリー</label>
                <select name='primary_category_id' className='selectcategory' value={category.primary_category_id}  onChange={handleInput}>
                    <option value=''>第一カテゴリーの選択</option>
                    {categoryList.primary_category_id.map((item)=>{
                      return (
                        <option value={item.id} key={item.id}>{item.primary_category_name}</option>
                      )
                    })}
                  </select>
                  <small style={{color:'red'}}>{category.error_list.primary_category_id}</small>
                </div>

              <div className='formInput'>
                <label>第二カテゴリー</label>
                <input type='text' placeholder='第二カテゴリー' name='secondary_category_name' onChange={handleInput} value={category.secondary_category_name} />
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
