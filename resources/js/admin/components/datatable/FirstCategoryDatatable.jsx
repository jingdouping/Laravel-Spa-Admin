import React, { useEffect, useState } from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { categoryColumns,userRows } from '../../datatablesource';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginaxios } from '../../../app';

const FirstCategoryDatatable = () => {
  const [categoryList,setCategoryList] = useState([]);


  useEffect(()=>{
    loginaxios.get('/api/view-firstcategory').then(res=>{
      if(res.status === 200){
        setCategoryList(res.data.primary_category)
      }
    });
  },[]);


  const deleteCategory = (e,id) =>{
    const result = window.confirm('本当に削除してよろしいですか？')
    if(result){
      e.preventDefault();
      const thisClicked = e.currentTarget;
      thisClicked.innerText = 'Deleting';
      loginaxios.post(`/api/delete-firstcategory/${id}`).then(res=>{
        if(res.data.status === 200){
          setCategoryList(categoryList.filter(prev=>prev.id !== id))
          Swal.fire({
            title: 'Success',
            text: res.data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          })
        }else if(res.data.status === 404){
          thisClicked.innerText = 'Delete';
        }
      })
    }
  }

  const actionColumn =[{
    field:'action',
    headerName:'Action',
    width:200,
    renderCell:(params)=>{
      return(
        <div className='cellAction' >
          <Link to={`/firstcategories/${params.row.id}`} style={{textDecoration:'none'}}>
            <div className='viewButton'>編集</div>
          </Link>
            <div className='deleteButton' onClick={(e)=>deleteCategory(e,params.row.id)}>削除</div>
        </div>
      )
    }
  }]

  return (
    <div className='datatable'>
      <div className='datatableTitle'>
        Add New Category
        <Link to='/firstcategories/new' className='link'>
          新規作成
        </Link>
      </div>

      <DataGrid
      className='datagrid'
        rows={categoryList}
        columns={categoryColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

    </div>
  )
}

export default FirstCategoryDatatable
