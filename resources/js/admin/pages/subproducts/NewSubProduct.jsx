import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Navigation } from "swiper";
import {SwiperSlide,Swiper } from 'swiper/react';
import "swiper/css";
import "swiper/css/navigation";
import NoImage from '../../image/no-image-icon-0.jpeg';
import "./newSubProduct.scss";
import { useLocation } from "react-router-dom";
import { loginaxios } from "../../../app";


export default function NewSubProduct(props) {
  const location = useLocation();
  const code = location.pathname.split('/')[3];
  const [categoryList,setCategoryList] = useState([])
  const [image,setImage] = useState({
    topimage:'',
    image1:'',
    image2:'',
    image3:'',
    image4:'',
    image5:'',
  });
  const [topImage,setTopImage] = useState('')
  const [error,setError] = useState([]);
  const [productInput,setProductInput] = useState({
    product_name:'',
    product_code:'',
    description:'',
    category:'',
    price:'',
    size:'',
    color:'',
    quantity:'',
    is_selling:'',
  });
  const [productList,setProductList] = useState([]);
  const [imageFocus,setImageFocus] = useState('topimage');

  useEffect(()=>{
    if(code){
      loginaxios.get(`/api/view-subproducts/${code}`).then(res=>{
        if(res.status === 200){
          setProductList(res.data.products)
          setProductInput({...productInput,product_name:res.data.products[0].product_name,product_code:res.data.products[0].product_code,description:res.data.products[0].description,category:res.data.products[0].secondary_category_id,price:res.data.products[0].price})
          setCategoryList(res.data.primary_category)
        }
      });
    }else{
      loginaxios.get('/api/view-subproducts').then(res=>{
        if(res.status === 200){
          setProductList(res.data.products)
          setCategoryList(res.data.primary_category)
        }
      });
    }
  },[]);


  const handleInput = (e) =>{
    if(e.target.name === 'product_code'){
      const selectedProductList = productList.filter(item => item.product_code === e.target.value);
      setProductInput({...productInput,product_name:selectedProductList[0].product_name,product_code:selectedProductList[0].product_code,description:selectedProductList[0].description,category:selectedProductList[0].secondary_category_id,price:selectedProductList[0].price})

    }else{
      setProductInput({...productInput,[e.target.name]:e.target.value});
    }
  }

  const handleImage = (e) =>{
    if(imageFocus == e.target.name){
      setTopImage(e.target.files[0])
    }
    setImage({...image,[e.target.name]:e.target.files[0]});
  }
  console.log(image.topimage);

  const submitProduct = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('topimage',image.topimage);
    formData.append('image1',(image.image1 === null || image.image1 === undefined) ? '':image.image1);
    formData.append('image2',(image.image2 === null || image.image2 === undefined) ? '':image.image2);
    formData.append('image3',(image.image3 === null || image.image3 === undefined) ? '':image.image3);
    formData.append('image4',(image.image4 === null || image.image4 === undefined) ? '':image.image4);
    formData.append('image5',(image.image5 === null || image.image5 === undefined) ? '':image.image5);
    formData.append('product_code',productInput.product_code);
    formData.append('color',productInput.color);

    console.log(formData.get('topimage'));
    // console.log(formData.getAll);


    loginaxios.post('/api/store-subproduct',formData).then(res=>{
      if(res.data.status === 200){
        setProductInput({
          product_name:'',
          product_code:'',
          description:'',
          category:'',
          price:'',
          color:'',
        });
        document.getElementById('PRODUCT_FORM').reset();
        setImage({
          topimage:'',
          image1:'',
          image2:'',
          image3:'',
          image4:'',
          image5:'',
        })
        setTopImage(null)
        setError([]);
        setImageFocus('topimage')
        Swal.fire({
          title: 'Success',
          text: res.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }else if(res.data.status === 422){
        setError(res.data.errors);
      }else if(res.data.status === 423){
        Swal.fire({
          title: 'Error',
          text: res.data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    });
  }

  const topImageHandler = (e) => {
    if(e.target.name === 'topimage'){
      if(image.topimage === ''){
        return
      }else{
        setTopImage(image.topimage);
        setImageFocus('topimage')
      }
    }
    if(e.target.name === 'image1'){
      if(image.image1 === ''){
        setTopImage(null)
        setImageFocus('image1');
        // return
      }else{
        setTopImage(image.image1);
        setImageFocus('image1');
      }
    }
    if(e.target.name === 'image2'){
      if(image.image2 === ''){
        setTopImage(null)
        setImageFocus('image2');
        // return
      }else{
        setTopImage(image.image2);
        setImageFocus('image2');
      }
    }
    if(e.target.name === 'image3'){
      if(image.image3 === ''){
        setTopImage(null)
        setImageFocus('image3');
      }else{
        setTopImage(image.image3);
        setImageFocus('image3');
      }
    }
    if(e.target.name === 'image4'){
      if(image.image4 === ''){
        setTopImage(null)
        setImageFocus('image4');

      }else{
        setTopImage(image.image4);
        setImageFocus('image4');
      }
    }
    if(e.target.name === 'image5'){
      if(image.image5 === ''){
        setTopImage(null)
        setImageFocus('image5');
      }else{
        setTopImage(image.image5);
        setImageFocus('image5');
      }
    }
  }

  const deleteImage = (e) => {
    if(e.target.name === imageFocus){
      setTopImage(null)
    }
    document.getElementById(e.target.name).value = '';
    setImage({...image,[e.target.name]:null})

  }


  return (
    <div className='new'>
      <Sidebar/>
      <div className='newContainer'>
        <div className='top'>
          <h1>{props.title}</h1>
        </div>
        <div className='bottom'>
          <div className='left'>
            <img src={topImage ? URL.createObjectURL(topImage) : NoImage} alt=''/>
            <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            navigation={true}
            loop={true}
            modules={[Navigation]}
            className="swiper">
              <SwiperSlide className="slideimage"><img src={image.topimage ? URL.createObjectURL(image.topimage) : NoImage} alt='' name='topimage' onClick={topImageHandler} className={imageFocus === 'topimage' ? 'focusimage' : ''} /></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image.image1 ? URL.createObjectURL(image.image1) : NoImage} alt='' name='image1' onClick={topImageHandler} className={imageFocus === 'image1' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image.image2 ? URL.createObjectURL(image.image2) : NoImage} alt='' name='image2' onClick={topImageHandler} className={imageFocus === 'image2' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image.image3 ? URL.createObjectURL(image.image3) : NoImage} alt='' name='image3' onClick={topImageHandler} className={imageFocus === 'image3' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image.image4 ? URL.createObjectURL(image.image4) : NoImage} alt='' name='image4' onClick={topImageHandler} className={imageFocus === 'image4' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image.image5 ? URL.createObjectURL(image.image5) : NoImage} alt='' name='image5' onClick={topImageHandler} className={imageFocus === 'image5' ? 'focusimage' : ''}/></SwiperSlide>
            </Swiper>
          <p style={{color:'red',fontSize:'small'}}>※Webサイトでは画像がない場合は詰めて表示されます</p>
          </div>
          <div className='right'>


            <form onSubmit={submitProduct} id='PRODUCT_FORM' encType='multipart/form-data'>
              <div className='formInput'>
                <label htmlFor='file'>
                  トップイメージ:<DriveFolderUploadIcon className='icon'/>
                </label>
                <input type='file' name="topimage" onChange={handleImage} id='file'/>
                <small style={{color:'red'}}>{error.topimage}</small>
              </div>
              <div className='formInput'>
                <label htmlFor='image1'>
                  イメージ１:<DriveFolderUploadIcon className='icon'/>
                </label>
                <input type='file' name="image1" onChange={handleImage} id='image1'/>
                <button type="button" name="image1" onClick={deleteImage}>削除</button>
                <small style={{color:'red'}}>{error.image1}</small>
              </div>
              <div className='formInput'>
                <label htmlFor='image2'>
                  イメージ２:<DriveFolderUploadIcon className='icon'/>
                </label>
                <input type='file' name="image2" onChange={handleImage} id='image2'/>
                <button type="button" name="image2" onClick={deleteImage}>削除</button>
                <small style={{color:'red'}}>{error.image2}</small>
              </div>
              <div className='formInput'>
                <label htmlFor='image3'>
                  イメージ３:<DriveFolderUploadIcon className='icon'/>
                </label>
                <input type='file' name="image3" onChange={handleImage} id='image3'/>
                <button type="button" name="image3" onClick={deleteImage}>削除</button>
                <small style={{color:'red'}}>{error.image3}</small>
              </div>
              <div className='formInput'>
                <label htmlFor='image4'>
                  イメージ４:<DriveFolderUploadIcon className='icon'/>
                </label>
                <input type='file' name="image4" onChange={handleImage} id='image4'/>
                <button type="button" name="image4" onClick={deleteImage}>削除</button>

                <small style={{color:'red'}}>{error.image4}</small>
              </div>
              <div className='formInput'>
                <label htmlFor='image5'>
                  イメージ５:<DriveFolderUploadIcon className='icon'/>
                </label>
                <input type='file' name="image5" onChange={handleImage} id='image5'/>
                <button type="button" name="image3" onClick={deleteImage}>削除</button>
                <small style={{color:'red'}}>{error.image5}</small>
              </div>


              <div className='formInput'>
                <label>商品コード</label>
                <select name='product_code' className='selectcategory' value={productInput.product_code} disabled={code ? true : false} onChange={handleInput}>
                  <option>商品コードを選択</option>
                  {productList.map((item)=>{
                    return (
                      <option value={item.product_code} key={item.id}>{item.product_code}</option>
                    )
                  })}
                </select>
                <small style={{color:'red'}}>{error.product_code}</small>
              </div>


              <div className='formInput'>
                <label>商品名</label>
                <input type='text' disabled value={productInput.product_name} placeholder='商品名' name='product_name'  onChange={handleInput}/>
                <small style={{color:'red'}}>{error.product_name}</small>
              </div>
              <div className='formInput'>
                <label>カテゴリー</label>
                <select name='category' disabled value={productInput.category}  className='selectcategory' onChange={handleInput}>
                  <option value=''>カテゴリーを選択</option>
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
                <input type='text' disabled value={productInput.price}  name='price' onChange={handleInput} placeholder='価格'/>
                <small style={{color:'red'}}>{error.price}</small>
              </div>
              <div className='formInput'>
                <label>詳細情報</label>
                <textarea rows='3' cols='50' disabled value={productInput.description}  type='text' name='詳細情報' onChange={handleInput} placeholder='Description'/>
                <small style={{color:'red'}}>{error.description}</small>
              </div>

              <div className='formInput'>
                <label>色</label>
                <input type='text' name='color' onChange={handleInput} placeholder='Color'/>
                <small style={{color:'red'}}>{error.color}</small>
              </div>

              <div className='formbutton'>
                <button>送信</button>
              </div>
            </form>


          </div>
        </div>

      </div>
    </div>
  );
}
