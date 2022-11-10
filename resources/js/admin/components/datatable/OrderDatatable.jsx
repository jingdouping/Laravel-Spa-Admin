import React, { useEffect, useState } from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { ordersColumns,userRows } from '../../datatablesource';
import { Link } from 'react-router-dom';
import { loginaxios } from '../../../app';

const OrderDatatable = () => {
  const [data,setData] = useState(userRows)
  const [orders,setOrders] = useState([])


  useEffect(()=>{
    loginaxios.get('/api/view-orders').then(res=>{
      if(res.status === 200){
        setOrders(res.data.orders)
      }
    });
  },[]);

  const actionColumn =[{
    field:'action',
    headerName:'Action',
    width:250,
    renderCell:(params)=>{
      return(
        <div className='cellAction'>
          <Link to={`/orders/${params.row.cart.id}`} style={{textDecoration:'none'}}>
            <div className='viewButton'>注文商品を見る</div>
          </Link>

        </div>
      )
    }
  }]


  return (
    <div className='datatable'>

      <DataGrid
      className='datagrid'
        rows={orders}
        columns={ordersColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

    </div>
  )
}

export default OrderDatatable
