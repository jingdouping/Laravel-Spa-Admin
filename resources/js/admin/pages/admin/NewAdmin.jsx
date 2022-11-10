import React, { useState } from 'react'
import './newAdmin.scss'
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginaxios } from '../../../app';

const NewAdmin = (props) => {
    const navigate = useNavigate()
    const [error,setError] = useState([]);

    const [admin,setAdmin] = useState({
        name:'',
        password:'',
        password_confirmation:'',
    })

    const handleInput = (e) => {
        setAdmin({...admin,[e.target.name]:e.target.value})
    }

    const submitCategory = (e) => {
      e.preventDefault()
      loginaxios.post('/api/store-admin',admin).then(res => {
        if(res.data.status === 200){
          document.getElementById('CATEGORY_FORM').reset();
          Swal.fire({
            title: 'Success',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          })
          navigate('/')
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
                  <label>管理者名</label>
                  <input type='text' placeholder='管理者名を入力' name='name' onChange={handleInput}/>
                  <small style={{color:'red'}}>{error.name}</small>
                </div>
                <div className='formInput'>
                  <label>パスワード</label>
                  <input type='password' placeholder='password' name='password' onChange={handleInput}/>
                  <small style={{color:'red'}}>{error.password}</small>
                </div>
                <div className='formInput'>
                  <label>パスワード確認</label>
                  <input type='password' placeholder='password_confirmation' name='password_confirmation' onChange={handleInput}/>
                  <small style={{color:'red'}}>{error.password_confirmation}</small>
                </div>
                <button style={{height:'35px',marginTop:'auto'}}>送信</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    );
}

export default NewAdmin
