import React, { useEffect, useState } from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { adminColumns,userRows } from '../../datatablesource';
import { Link } from 'react-router-dom';
import { loginaxios, tologinaxios } from '../../../app';

const AdminDatatable = () => {
  const [data,setData] = useState(userRows)
  const [admins,setAdmins] = useState([])


  useEffect(()=>{
    loginaxios.get('/api/view-admins').then(res=>{
      if(res.data.status === 200){
        setAdmins(res.data.admins)
      }
    });
  },[]);


  return (
    <div className='datatable'>

    <div className='datatableTitle'>
        Add New Admin
        <Link to='/new' className='link'>
          管理者追加
        </Link>
      </div>

      <DataGrid
      className='datagrid'
        rows={admins}
        columns={adminColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

    </div>
  )
}

export default AdminDatatable
