import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {tologinaxios } from '../../../app.jsx'
import { adminloggedin } from '../../../redux/adminloginRedux'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import './adminLogin.scss';


const Login = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [error,setError] = useState([])

    const [loginInput,setLoginInput] = useState({
        name:'',
        password:'',
    })

    const handleInput = (e) => {
        setLoginInput({...loginInput,[e.target.name]:e.target.value})
    }

    const handleClick = (e) => {
        e.preventDefault()
        tologinaxios.get('/sanctum/csrf-cookie').then(response => {
        tologinaxios.post('/adminlogin',loginInput).then(res=>{
        if(res.data.status === 200){
            localStorage.setItem('adminloggedin',true);
            dispatch(adminloggedin());
            navigation('/');
        }else if(res.data.status === 401){
            setError({password:res.data.message})
        }else{
            setError(res.data.validation_errors)
        }
        }).catch(error => {
            if(error.response.status === 429){
                Swal.fire({
                    title: 'Error',
                    text:'ログインに５回失敗しました。５分後に再開できます。',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        });
        });
    }

  return (
    <div className='adminlogincontainer'>
        <div className='loginwrapper'>
            <h1 className='logintitle'>管理者ログイン</h1>
            <form className='loginform'>
                <input className='logininput' placeholder="管理者名" type='text' name='name' onChange={handleInput} />
                <small style={{color:'red'}}>{error.name}</small>
                <input className='logininput' placeholder="password" type='password' name='password' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.password}</small>
                <button className='loginbutton' onClick={handleClick}>ログイン</button>
            </form>
        </div>

    </div>
  )
}

export default Login
