import React, { useEffect, useState } from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { userColumns,userRows } from '../../datatablesource';
import { loginaxios } from '../../../app';

const UserDatatable = () => {
  const [users,setUsers] = useState([])


  useEffect(()=>{
    loginaxios.get('/api/view-users').then(res=>{
      if(res.status === 200){
        setUsers(res.data.users)
      }
    });
  },[]);


  return (
    <div className='datatable'>

      <DataGrid
      className='datagrid'
        rows={users}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

    </div>
  )
}

export default UserDatatable
