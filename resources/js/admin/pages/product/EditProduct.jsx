import Sidebar from "../../components/sidebar/Sidebar";
import "./newProduct.scss";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { loginaxios } from "../../../app";

export default function EditProduct(props) {
  const navigate = useNavigate();
  const [categoryList,setCategoryList] = useState([])
  // const [file,setFile] = useState('');
  const [error,setError] = useState([]);
  // const [picture,setPicture] = useState({});
  const [productInput,setProductInput] = useState({
    product_name:'',
    product_code:'',
    description:'',
    secondary_category_id:'',
    price:'',
  });
  const [displayPrice,setDisplayPrice] = useState('');
  const [priceType,setPriceType] = useState('text');


  useEffect(()=>{
    loginaxios.get('/api/view-firstcategory').then(res=>{
      if(res.status === 200){
        setCategoryList(res.data.primary_category)
      }
    });

  },[]);

  let {productid} = useParams();
  useEffect(()=>{
    loginaxios.get(`/api/edit-product/${productid}`).then(res=>{
      if(res.data.status === 200){
        setProductInput(res.data.product);
        setDisplayPrice(String(res.data.product.price).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      }else if(res.data.status === 404){
      }
    });

  },[])

  useEffect(()=>{
    setDisplayPrice(productInput.price)
  },[productInput.price])

  useEffect(()=>{
    if(priceType === 'text'){
      let num =String( productInput.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setDisplayPrice(num)
    }
  },[priceType])

  const focusType = () => {
    setPriceType('number')
    setDisplayPrice(productInput.price)
  }

  const blueType = () => {
    setPriceType('text')
  }


  const handleInput = (e) =>{
    // e.perist();
    setProductInput({...productInput,[e.target.name]:e.target.value});
  }

  // const handleImage = (e) =>{
  //   // e.perist();
  //   setFile(e.target.files[0])
  //   setPicture({image:e.target.files[0]});
  // }

  const submitProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    // formData.append('image',picture.image === undefined ? productInput.image : picture.image);
    formData.append('product_name',productInput.product_name);
    formData.append('product_code',productInput.product_code);
    formData.append('description',productInput.description == 'null' ? '':productInput.description);
    formData.append('price',productInput.price);
    formData.append('category',productInput.secondary_category_id);


    loginaxios.post(`/api/update-product/${productid}`,formData).then(res=>{
      if(res.data.status === 200){
        setProductInput({
          product_name:'',
          product_code:'',
          description:'',
          category:'',
          price:'',
        });
        // setPicture({});
        document.getElementById('PRODUCT_FORM').reset();
        // setFile('')
        // setPicture([]);
        setError([]);
        navigate('/products');
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }else if(res.data.status === 422){
        setError(res.data.errors);
      }
    });
  }

  return (
    <div className='new'>
      <Sidebar/>
      <div className='newContainer'>
        <div className='top'>
          <h1>{props.title}</h1>
        </div>
        <div className='bottom'>
          {/* <div className='left'>
            <img src={file ? URL.createObjectURL(file) : `http://localhost:8000/${productInput.image}`} alt=''/>
          </div> */}
          <div className='right'>


            <form onSubmit={submitProduct} id='PRODUCT_FORM' encType='multipart/form-data'>
              {/* <div className='formInput'>
                <label htmlFor='file'>
                  Image:<DriveFolderUploadIcon className='icon'/>
                </label>
                <input type='file' name="image" onChange={handleImage} id='file'/>
                <small style={{color:'red'}}>{error.image}</small>
              </div> */}

              {/* {props.inputs.map(input=>(
              <div className='formInput' key={input.id}>
                <label>{input.label}</label>
                <input type={input.type} placeholder={input.placeholder}/>
              </div>
              ))} */}

              <div className='formInput'>
                <label>商品コード</label>
                <input type='text' placeholder='商品コード' value={productInput.product_code} name='product_code' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.product_code}</small>
              </div>
              <div className='formInput'>
                <label>商品名</label>
                <input type='text' placeholder='商品名' value={productInput.product_name} name='product_name' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.product_name}</small>
              </div>
              <div className='formInput'>
                <label>カテゴリー</label>
                <select name='secondary_category_id' className='selectcategory' value={productInput.secondary_category_id} onChange={handleInput}>
                  <option value=''>カテゴリーの選択</option>
                  {categoryList.map((primary_category)=>{
                    return (
                      <optgroup key={primary_category.id} label={primary_category.primary_category_name}>
                        {primary_category.secondarycategory.map((item)=>{
                          return (
                            <option value={item.id} key={item.id}>{item.secondary_category_name}</option>
                          )
                        })}
                      </optgroup>
                    )
                  })}
                </select>
                <small style={{color:'red'}}>{error.category}</small>
              </div>

              <div className='formInput'>
                <label>価格</label>
                <input type={priceType} name='price' onChange={handleInput} placeholder='価格' value={displayPrice} onBlur={blueType} onFocus={focusType}/>
                <small style={{color:'red'}}>{error.price}</small>
              </div>
              <div className='formInput'>
                <label>詳細</label>
                <textarea rows='3' cols='50' type='text'  value={productInput.description} name='description' onChange={handleInput} placeholder='Description'/>
                <small style={{color:'red'}}>{error.description}</small>
              </div>


              <div className='formbutton'>
                <button>変更</button>
              </div>
            </form>


          </div>
        </div>

      </div>
    </div>
  );
}
