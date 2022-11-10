import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {SwiperSlide,Swiper } from 'swiper/react';
import { Navigation } from "swiper";
import NoImage from '../../image/no-image-icon-0.jpeg';
import { loginaxios } from "../../../app";
// import "./editSubProduct.scss";


export default function EditSubProduct(props) {
  const navigate = useNavigate();
  const [categoryList,setCategoryList] = useState([])
  const [image,setImage] = useState({
    topimage:'',
    image1:'',
    image2:'',
    image3:'',
    image4:'',
    image5:'',
  });
  const [file,setFile] = useState({
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
    color:'',
  });
  const [productList,setProductList] = useState([]);
  const [imageFocus,setImageFocus] = useState('topimage');

  let {productid} = useParams();
  useEffect(()=>{
    // const category_id = props.match.params.id;
    loginaxios.get(`/api/edit-subproduct/${productid}`).then(res=>{
      if(res.data.status === 200){
        setProductInput({...productInput,product_name:res.data.product.product.product_name,product_code:res.data.product.product.product_code,image:res.data.product.image,description:res.data.product.product.description,category:res.data.product.product.secondary_category_id,price:res.data.product.product.price,color:res.data.product.color});
        setImage({...image,topimage:res.data.product.topimage,image1:res.data.product.image1,image2:res.data.product.image2,image3:res.data.product.image3,image4:res.data.product.image4,image5:res.data.product.image5})

        setTopImage(res.data.product.topimage)

        setCategoryList(res.data.primary_category)

        setProductList(res.data.products)

      }else if(res.data.status === 404){
      }
    });
  },[])

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

    setFile({...file,[e.target.name]:e.target.files[0]});
    // setTopImageFile(e.target.files[0])
  }




  const submitProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('topimage',image.topimage);
    formData.append('image1',(image.image1 === null || image.image1 === undefined) ? '':image.image1);
    formData.append('image2',(image.image2 === null || image.image2 === undefined) ? '':image.image2);
    formData.append('image3',(image.image3 === null || image.image3 === undefined) ? '':image.image3);
    formData.append('image4',(image.image4 === null || image.image4 === undefined) ? '':image.image4);
    formData.append('image5',(image.image5 === null || image.image5 === undefined) ? '':image.image5);
    formData.append('product_code',productInput.product_code);
    formData.append('color',productInput.color);

    loginaxios.post(`/api/update-subproduct/${productid}`,formData).then(res=>{
      if(res.data.status === 200){
        navigate('/subproducts');
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
      if(image.topimage === null){
        return
      }else{
        setTopImage(image.topimage);
        setImageFocus('topimage')
      }
    }
    if(e.target.name === 'image1'){
      if(image.image1 === null){
        setTopImage(null)
        setImageFocus('image1');
        // return
      }else{
        setTopImage(image.image1);
        setImageFocus('image1');
      }
    }
    if(e.target.name === 'image2'){
      if(image.image2 === null){
        setTopImage(null)
        setImageFocus('image2');
        // return

      }else{
        setTopImage(image.image2);
        setImageFocus('image2');
      }
    }
    if(e.target.name === 'image3'){
      if(image.image3 === null){
        setTopImage(null)
        setImageFocus('image3');
        // return
      }else{
        setTopImage(image.image3);
        setImageFocus('image3');
      }
    }
    if(e.target.name === 'image4'){
      if(image.image4 === null){
        setTopImage(null)
        setImageFocus('image4');
        // return
      }else{
        setTopImage(image.image4);
        setImageFocus('image4');
      }
    }
    if(e.target.name === 'image5'){
      if(image.image5 === null){
        setTopImage(null)
        setImageFocus('image5');
        // return
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

  let topimage = ''
  if(image.topimage){
    if(file.topimage){
      topimage = URL.createObjectURL(file.topimage)
    }else if(!file.topimage){
      topimage = `http://127.0.0.1:8001/${image.topimage}`
    }
  }else if(!image.topimage){
    topimage = NoImage
  }

  let image1 = ''
  if(image.image1){
    if(file.image1){
      image1 = URL.createObjectURL(file.image1)
    }else if(!file.image1){
      image1 = `http://127.0.0.1:8001/${image.image1}`
    }
  }else if(!image.image1){
    image1 = NoImage
  }

  let image2 = ''
  if(image.image2){
    if(file.image2){
      image2 = URL.createObjectURL(file.image2)
    }else if(!file.image2){
      image2 = `http://127.0.0.1:8001/${image.image2}`
    }
  }else if(!image.image2){
    image2 = NoImage
  }

  let image3 = ''
  if(image.image3){
    if(file.image3){
      image3 = URL.createObjectURL(file.image3)
    }else if(!file.image3){
      image3 = `http://127.0.0.1:8001/${image.image3}`
    }
  }else if(!image.image3){
    image3 = NoImage
  }

  let image4 = ''
  if(image.image4){
    if(file.image4){
      image4 = URL.createObjectURL(file.image4)
    }else if(!file.image4){
      image4 = `http://127.0.0.1:8001/${image.image4}`
    }
  }else if(!image.image4){
    image4 = NoImage
  }

  let image5 = ''
  if(image.image5){
    if(file.image5){
      image5 = URL.createObjectURL(file.image5)
    }else if(!file.image5){
      image5 = `http://127.0.0.1:8001/${image.image5}`
    }
  }else if(!image.image5){
    image5 = NoImage
  }

  let topimg = ''
  if(!topImage){
    // topimg = `${process.env.PUBLIC_URL}/image/no-image-icon-0.jpeg`;
    topimg = NoImage;
  }else if(topImage){
    if(topImage.type){
      topimg = URL.createObjectURL(topImage)
    }else if(!topImage.type){
      topimg = `http://127.0.0.1:8001/${topImage}`
    }
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
            <img src={topimg} alt=''/>
            <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            navigation={true}
            loop={true}
            modules={[Navigation]}
            className="swiper">
              <SwiperSlide className="slideimage"><img src={topimage} alt='' name='topimage' onClick={topImageHandler} className={imageFocus === 'topimage' ? 'focusimage' : ''} /></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image1} alt='' name='image1' onClick={topImageHandler} className={imageFocus === 'image1' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image2} alt='' name='image2' onClick={topImageHandler} className={imageFocus === 'image2' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image3} alt='' name='image3' onClick={topImageHandler} className={imageFocus === 'image3' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image4} alt='' name='image4' onClick={topImageHandler} className={imageFocus === 'image4' ? 'focusimage' : ''}/></SwiperSlide>
              <SwiperSlide className="slideimage"><img src={image5} alt='' name='image5' onClick={topImageHandler} className={imageFocus === 'image5' ? 'focusimage' : ''}/></SwiperSlide>
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
                <div>
                <label htmlFor='image1'>
                  イメージ１:<DriveFolderUploadIcon className='icon'/>
                </label>
                </div>
                <input type='file' name="image1" onChange={handleImage} id='image1' />
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
                <button type="button" name="image5" onClick={deleteImage}>削除</button>
                <small style={{color:'red'}}>{error.image5}</small>
              </div>


             <div className='formInput'>
                <label>商品コード</label>
                <select name='product_code' value={productInput.product_code} className='selectcategory' onChange={handleInput}>
                  <option value=''>商品コードの選択</option>
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
                <input type='text' disabled value={productInput.product_name} placeholder='Product Name' name='product_name' onChange={handleInput}/>
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
                <input type='text' disabled value={productInput.price}  name='price' onChange={handleInput} placeholder='Price'/>
                <small style={{color:'red'}}>{error.price}</small>
              </div>
              <div className='formInput'>
                <label>詳細情報</label>
                <textarea rows='3' cols='50' disabled value={productInput.description}  type='text' name='description' onChange={handleInput} placeholder='Description'/>
                <small style={{color:'red'}}>{error.description}</small>
              </div>


              <div className='formInput'>
                <label>色</label>
                <input type='text' name='color' value={productInput.color} onChange={handleInput} placeholder='Color'/>
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
