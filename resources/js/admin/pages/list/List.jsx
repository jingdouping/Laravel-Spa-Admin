import React from 'react'
import './list.scss';
import Sidebar from '../../components/sidebar/Sidebar'
import { useLocation } from 'react-router-dom';
import ProductDatatable from '../../components/datatable/ProductDatatable';
import UserDatatable from '../../components/datatable/UserDatatable';
import FirstCategoryDatatable from '../../components/datatable/FirstCategoryDatatable';
import SecondCategoryDatatable from '../../components/datatable/SecondCategoryDatatable';
import SubProductDatatable from '../../components/datatable/SubProductDatatable';
import OrderDatatable from '../../components/datatable/OrderDatatable';
import AdminDatatable from '../../components/datatable/AdminDatatable';


const LIst = () => {
  const location = useLocation();
  const id = location.pathname.split('/')[1];

  let datatable = ''
  if(!id){
    datatable = (
        <AdminDatatable/>
    )
  }else if(id === 'users'){
    datatable = (
      <UserDatatable/>
    )
  }else if(id === 'products'){
    datatable = (
      <ProductDatatable/>
    )
  }else if(id === 'subproducts'){
    datatable = (
      <SubProductDatatable/>
    )
  }else if(id === 'firstcategories'){
    datatable = (
      <FirstCategoryDatatable/>
    )
  }else if(id === 'secondcategories'){
    datatable = (
      <SecondCategoryDatatable/>
    )
  }else if(id === 'orders'){
    datatable = (
      <OrderDatatable/>
    )
  }

  return (
    <div className='list'>

      <Sidebar/>
      <div className='listContainer'>
        {datatable}

      </div>
    </div>
  )
}

export default LIst
