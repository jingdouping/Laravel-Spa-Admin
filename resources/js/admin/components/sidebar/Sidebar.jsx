import React from 'react'
import './sidebar.scss';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Link, useNavigate } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import { tologinaxios } from '../../../app';
import { adminloggedout } from '../../../redux/adminloginRedux'
import { useDispatch } from 'react-redux'

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const logoutHandler =(e)=>{
        e.preventDefault();
        tologinaxios.post('/api/adminlogout').then(res=>{
            if(res.data.status === 200){
                localStorage.removeItem('auth_name');
                localStorage.removeItem('adminloggedin');
                dispatch(adminloggedout())
                navigation('/');
            }
            });
    }

  return (
    <div className='sidebar'>
      <div className='top'>
        <Link to='/' style={{textDecoration:'none'}}>
          <span className='logo'>FashionAdmin</span>
        </Link>
      </div>
      <hr/>
      <div className='center'>
        <ul>

          <p className='title'>Lists</p>
          <Link to='/users' style={{textDecoration:'none'}}>
            <li>
              <PersonOutlineOutlinedIcon className='icon'/>
              <span>ユーザー</span>
            </li>
          </Link>
          <Link to='/firstcategories' style={{textDecoration:'none'}}>
            <li>
              <CategoryIcon className='icon'/>
              <span>第一カテゴリー</span>
            </li>
          </Link>
          <Link to='/secondcategories' style={{textDecoration:'none'}}>
            <li>
              <BookmarkIcon className='icon'/>
              <span>第二カテゴリー</span>
            </li>
          </Link>
          <Link to='/products' style={{textDecoration:'none'}}>
            <li>
              <StorefrontIcon className='icon'/>
              <span>品番</span>
            </li>
          </Link>
          <Link to='/subproducts' style={{textDecoration:'none'}}>
            <li>
              <Inventory2Icon className='icon'/>
              <span>商品</span>
            </li>
          </Link>
          <Link to='/orders' style={{textDecoration:'none'}}>
            <li>
              <CreditCardIcon className='icon'/>
              <span>オーダー</span>
            </li>
          </Link>
            <li onClick={logoutHandler}>
                <LogoutIcon className='icon'/>
                <span>ログアウト</span>
            </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
