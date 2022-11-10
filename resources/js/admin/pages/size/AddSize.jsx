import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { loginaxios } from '../../../app'
import Sidebar from '../../components/sidebar/Sidebar'
import './addSize.scss'

const AddSize = (props) => {
  const navigate = useNavigate()
  let {productid} = useParams();
  const [error,setError] = useState([]);
  const [input,setInput] = useState({
    size:'',
    quantity:'',
    // is_selling:'1',
  })

  console.log(productid);


  const handleInput = (e) => {
    // e.persist();
    setInput({...input,[e.target.name]:e.target.value})
  }

  const inputSubmit = (e) => {
    e.preventDefault();
    loginaxios.post(`/api/store-size/${productid}`,input).then(res=>{
      if(res.data.status === 200){
        document.getElementById('FORM').reset();
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        navigate(`/subproducts/viewsize/${productid}`)
      }else if(res.data.status === 422){
        setError(res.data.errors);
      }
    })
  }

  console.log(input);

  return (
    <div className='new'>
      <Sidebar/>
      <div className='newContainer'>
        <div className='top'>
          <h1>{props.title}</h1>
        </div>
        <div className='bottom'>

          <div className='right'>
            <form id='FORM' onSubmit={inputSubmit}>
              <div className='formInput'>
                <label>Size</label>
                <input type='text' placeholder='Size' onChange={handleInput} name='size' />
                <small style={{color:'red'}}>{error.size}</small>
              </div>
              <div className='formInput'>
                <label>数量</label>
                <input type='number' placeholder='数量' onChange={handleInput} name='quantity' />
                <small style={{color:'red'}}>{error.quantity}</small>
              </div>
              {/* <div className='formInput'>
                <label style={{marginBottom:'4px'}}>販売状態</label>
                <select name='is_selling' onChange={handleInput}>
                  <option value='1'>販売中</option>
                  <option value='0'>販売停止</option>
                </select>
                <small style={{color:'red'}}>{error.is_selling}</small>
              </div> */}
              <button style={{height:'35px',marginTop:'auto'}}>送信</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AddSize
