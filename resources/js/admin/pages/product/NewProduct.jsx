import Sidebar from "../../components/sidebar/Sidebar";
import "./newProduct.scss";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { loginaxios } from "../../../app";

export default function NewProduct(props) {
  const [categoryList,setCategoryList] = useState([])
  // const [file,setFile] = useState('');
  const [error,setError] = useState([]);
  // const [picture,setPicture] = useState({});
  const [productInput,setProductInput] = useState({
    product_name:'',
    product_code:'',
    description:'',
    category:'',
    price:'',
  });

  const [priceType,setPriceType] = useState('text');
  const [displayPrice,setDisplayPrice] = useState('');

  useEffect(()=>{
    loginaxios.get('/api/view-firstcategory').then(res=>{
      if(res.status === 200){
        setCategoryList(res.data.primary_category)
      }
    });
  },[]);


  useEffect(()=>{
    setDisplayPrice(productInput.price)
  },[productInput.price])

  const handleInput = (e) =>{
    setProductInput({...productInput,[e.target.name]:e.target.value});
  }

  useEffect(()=>{
    if(priceType === 'text'){
      let num = productInput.price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  // const handleImage = (e) =>{
  //   // e.perist();
  //   setFile(e.target.files[0])
  //   setPicture({image:e.target.files[0]});
  // }

  const submitProduct = (e) => {
    e.preventDefault();

    const formData = new FormData();
    // formData.append('image',picture.image);
    formData.append('product_name',productInput.product_name);
    formData.append('product_code',productInput.product_code);
    formData.append('description',productInput.description == 'null' ? '':productInput.description);
    formData.append('price',productInput.price);
    formData.append('category',productInput.category);


    loginaxios.post('/api/store-product',formData).then(res=>{
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
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }else if(res.data.status === 422){
        setError(res.data.errors);
      }else if(res.data.status === 500){
        setError({...error,product_code:res.data.message})
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

          <div className='right'>


            <form onSubmit={submitProduct} id='PRODUCT_FORM' encType='multipart/form-data'>


              <div className='formInput'>
                <label>商品コード</label>
                <input type='text' placeholder='商品コード' name='product_code' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.product_code}</small>
              </div>
              <div className='formInput'>
                <label>商品名</label>
                <input type='text' placeholder='商品名' name='product_name' onChange={handleInput}/>
                <small style={{color:'red'}}>{error.product_name}</small>
              </div>
              <div className='formInput'>
                <label>カテゴリー</label>
                <select name='category' className='selectcategory' onChange={handleInput}>
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
                <textarea rows='3' cols='50' type='text' name='description' onChange={handleInput} placeholder='詳細' value={productInput.description}/>
                <small style={{color:'red'}}>{error.description}</small>
              </div>


              <div className='formbutton'>
                <button>作成</button>
              </div>
            </form>


          </div>
        </div>

      </div>
    </div>
  );
}
