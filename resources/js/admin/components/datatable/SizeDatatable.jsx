import React, { useEffect, useState } from 'react'
import './sizedatatable.scss'
import { DataGrid } from '@mui/x-data-grid';
import { sizeColumns } from '../../datatablesource';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import { loginaxios } from '../../../app';


const SizeDatatable = () => {
  let {productid} = useParams();
  const [sizeList,setSizeList] = useState([])
  // const [mount,setMount] = useState(false)

  useEffect(()=>{
    loginaxios.get(`/api/view-size/${productid}`).then(res=>{
      if(res.status === 200){
        let sizearray = []
        res.data.size.map(item=>{
          sizearray.push({...item,is_selling:item.is_selling === 1 ? '販売中' : '販売停止'})
        })
        setSizeList(sizearray)
      }
    });
  },[]);

  const deleteProduct = (e,id) => {
    const result = window.confirm('本当に削除してよろしいですか？')
    if(result){
      e.preventDefault();
      loginaxios.post(`/api/delete-size/${id}`).then(res=>{
        if(res.data.status === 200){
          setSizeList(sizeList.filter(prev=>prev.id !== id))
        }
      })
    }
  }

  // const changeStatus = (e,id) => {
  //   e.preventDefault();

  //   axios.post(`/api/change-status/${id}`).then(res=>{
  //     if(res.data.status === 200){
  //       let sizearray = []
  //       sizeList.map(item=>{
  //         if(item.id === id){
  //           sizearray.push({...item,is_selling:res.data.is_selling === 1 ? '販売中' : '販売停止'})
  //         }else if(item.id !== id){
  //           sizearray.push(item)
  //         }
  //       })
  //       setSizeList(sizearray)
  //     }else if(res.data.status === 404){

  //     }
  //   });

  // }


  const actionColumn =[{
    field:'action',
    headerName:'Action',
    width:400,
    renderCell:(params)=>{
      return(
        <div className='cellAction'>
          {/* <div className='changeButton' onClick={(e)=>changeStatus(e,params.row.id)}>Change Status</div> */}
          <Link to={`/subproducts/editsize/${params.row.id}/${params.row.subproduct_id}`} style={{textDecoration:'none'}}>
            <div className='viewButton'>編集</div>
          </Link>
          <div className='deleteButton' onClick={(e)=>deleteProduct(e,params.row.id)}>削除</div>
          {/* <div className='changeButton' onClick={(e)=>changeStatus(e,params.row.id)}>ステータス変更</div> */}
        </div>
      )
    }
  }]


  return (
    <div className='list'>

    <Sidebar/>
    <div className='listContainer'>



      <div className='datatable'>
      <div className='datatableTitle'>
        Size,数量
        <div>
        <Link to={`/subproducts`}  className='link' style={{marginRight:'8px',color:'royalblue',borderColor:'royalblue'}}>
          商品一覧に戻る
        </Link>
        <Link to={`/subproducts/size/${productid}`}  className='link'>
          新規作成
        </Link>
        </div>
      </div>

      <DataGrid
      className='datagrid'
        rows={sizeList}
        columns={sizeColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>

    </div>
    </div>

  )
}

export default SizeDatatable
