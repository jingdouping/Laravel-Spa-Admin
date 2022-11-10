import Sidebar from "../../components/sidebar/Sidebar";
import "./newCategory.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginaxios } from "../../../app";

export default function NewFirstCategory(props) {
  const navigate = useNavigate()
  const [error,setError] = useState([]);

  const [category,setCategory] = useState({
    first_category_name:'',
  })

  const handleInput = (e) => {
    setCategory({...category,[e.target.name]:e.target.value})
  }

  const submitCategory = (e) => {
    e.preventDefault()
    loginaxios.post('/api/store-firstcategory',category).then(res => {
      if(res.data.status === 200){
        document.getElementById('CATEGORY_FORM').reset();
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        navigate('/firstcategories')
      }else if(res.data.status === 400){

        setError(res.data.errors);
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
                <input type='text' placeholder='第一カテゴリーを入力' name='primary_category_name' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.primary_category_name}</small>
              </div>
              <button style={{height:'35px',marginTop:'auto'}}>送信</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
