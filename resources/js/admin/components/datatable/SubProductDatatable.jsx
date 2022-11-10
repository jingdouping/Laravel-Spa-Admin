import React, { useEffect, useState } from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { subProductColumns } from '../../datatablesource';
import { Link } from 'react-router-dom';
import { loginaxios } from '../../../app';


const SubProductDatatable = () => {

  const [productList,setProductList] = useState([])
  // const [mount,setMount] = useState(false)

  useEffect(()=>{
    loginaxios.get('/api/view-subproducts').then(res=>{
      if(res.status === 200){
        let proarray = [];
        res.data.subproducts.map(item =>{
          proarray.push({...item,product_code:item.product.product_code,product_name:item.product.product_name})
        })
        setProductList(proarray)
        // setMount(true)
      }
    });
  },[]);

  let rows = []
  productList.map(product => {
    rows.push({...product,product_code:product.product.product_code,color:product.color,product_name:product.product.product_name})
  })


  const deleteProduct = (e,id) => {
    const result = window.confirm('本当に削除してよろしいですか？')
    if(result){
      e.preventDefault();
      loginaxios.post(`/api/delete-subproduct/${id}`).then(res=>{
        if(res.data.status === 200){
          setProductList(productList.filter(prev=>prev.id !== id))
        }
      })
    }
  }


  const actionColumn =[{
    field:'action',
    headerName:'Action',
    width:400,
    renderCell:(params)=>{
      return(
        <div className='cellAction'>
          {/* <div className='changeButton' onClick={(e)=>changeStatus(e,params.row.id)}>Change Status</div> */}
          <Link to={`/subproducts/${params.row.id}`} style={{textDecoration:'none'}}>
            <div className='viewButton'>編集</div>
          </Link>
          <div className='deleteButton' onClick={(e)=>deleteProduct(e,params.row.id)}>削除</div>
          <Link to={`/subproducts/size/${params.row.id}`} style={{textDecoration:'none'}}>
          <div className='viewButton'>サイズ数量追加</div>
          </Link>
          <Link to={`/subproducts/viewsize/${params.row.id}`} style={{textDecoration:'none'}}>
          <div className='viewSizeButton'>サイズ数量確認</div>
          </Link>
        </div>
      )
    }
  }]


  return (

      <div className='datatable'>
      <div className='datatableTitle'>
        Sub Product
        <Link to='/subproducts/new' className='link'>
          新規作成
        </Link>
      </div>

      <DataGrid
      className='datagrid'
        rows={rows}
        columns={subProductColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>

  )
}

export default SubProductDatatable
