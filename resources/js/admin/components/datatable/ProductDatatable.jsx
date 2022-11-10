import React, { useEffect, useState } from 'react'
import './datatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { productColumns,userRows } from '../../datatablesource';
import { Link } from 'react-router-dom';
import { loginaxios } from '../../../app';

const ProductDatatable = () => {

  const [productList,setProductList] = useState ([])

  useEffect(()=>{
    loginaxios.get('/api/view-product').then(res=>{
      if(res.status === 200){
        setProductList(res.data.products)
      }
    });
  },[]);

  // useEffect(()=>{
  //   let num = productList.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   setDisplayPrice(num)
  // },[productList[0].price])

  const rows = []
  productList.map(product => {
    rows.push({...product,first_category_name:product.secondarycategory.primarycategory.primary_category_name,second_category_name:product.secondarycategory.secondary_category_name,price:String(product.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')})
  })

  const deleteProduct = (e,id) => {
    const result = window.confirm('本当に削除してよろしいですか？')
    if(result){
      e.preventDefault();
      const thisClicked = e.currentTarget;
      thisClicked.innerText = 'Deleting';

      loginaxios.post(`/api/delete-product/${id}`).then(res=>{
        if(res.data.status === 200){
          setProductList(productList.filter(prev=>prev.id !== id))
        }else if(res.data.status === 404){
          thisClicked.innerText = 'Delete';
        }
      })
    }
  }

  const actionColumn =[{
    field:'action',
    headerName:'Action',
    width:250,
    renderCell:(params)=>{
      return(
        <div className='cellAction'>
          <Link to={`/products/${params.row.id}`} style={{textDecoration:'none'}}>
            <div className='viewButton'>編集</div>
          </Link>
            <div className='deleteButton' onClick={(e)=>deleteProduct(e,params.row.id)}>削除</div>
            <Link to={`/subproducts/new/${params.row.product_code}`} style={{textDecoration:'none'}}>
            <div className='viewSizeButton'>商品追加</div>
          </Link>
        </div>
      )
    }
  }]

  return (
      <div className='datatable'>
      <div className='datatableTitle'>
        Product
        <Link to='/products/new' className='link'>
          新規作成
        </Link>
      </div>
      <DataGrid
      className='datagrid'
        rows={rows}
        columns={productColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>

  )
}

export default ProductDatatable
