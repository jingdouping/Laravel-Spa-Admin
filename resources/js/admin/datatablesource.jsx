export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

];

export const adminColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "admin",
    headerName: "Adminsname",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.name}
        </div>
      );
    },
  },

];


export const productColumns = [
  { field: "product_code", headerName: "商品コード", width: 150 },
  {
    field: "product_name",
    headerName: "商品名",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={`http://localhost:8000/${params.row.image}`} alt="avatar" /> */}
          {params.row.product_name}
        </div>
      );
    },
  },
  {
    field: "first_category_name",
    headerName: "第一カテゴリー",
    width: 150,
  },
  {
    field: "second_category_name",
    headerName: "第二カテゴリー",
    width: 150,
  },
  {
    field: "price",
    headerName: "価格",
    width: 100,
  },

];

export const subProductColumns = [
  { field: "product_code", headerName: "商品コード", width: 150 },
  {
    field: "product_name",
    headerName: "商品名",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={`http://127.0.0.1:8001/${params.row.topimage}`} alt="avatar" />
          {params.row.product_name}
        </div>
      );
    },
  },
  {
    field: "color",
    headerName: "Color",
    width: 100,
    renderCell:(params) => {
      return (
        <div style={{backgroundColor:`${params.row.color}`}} className="cellColor"/>
        // <div className="cellColor" />
      )
    }
  },

];


export const sizeColumns = [
  {
    field: "size",
    headerName: "Size",
    width: 100,
  },
  {
    field: "quantity",
    headerName: "数量",
    width: 100,
  },
  // {
  //   field: "is_selling",
  //   headerName: "ステータス",
  //   width: 100,
  // },

];


export const categoryColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "category",
    headerName: "第一カテゴリー",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.primary_category_name}
        </div>
      );
    },
  },
  { field: "created_at", headerName: "created_at", width: 200 },
];

export const secondaryCategoryColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "firstcategory",
    headerName: "第一カテゴリー",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.primarycategory.primary_category_name}
        </div>
      );
    },
  },
  {
    field: "secondcategory",
    headerName: "第二カテゴリー",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.secondary_category_name}
        </div>
      );
    },
  },
  { field: "created_at", headerName: "作成日", width: 200 },
];

export const ordersColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "ユーザー",
    width: 90,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.user.name}
        </div>
      );
    },
  },
  {
    field: "address_code",
    headerName: "郵便番号",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.user.address_code}
        </div>
      );
    },
  },
  {
    field: "address1",
    headerName: "住所",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.user.address1}
        </div>
      );
    },
  },
  {
    field: "post_code",
    headerName: "丁目/番地/号",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.user.post_code}
        </div>
      );
    },
  },
  {
    field: "mansion",
    headerName: "建物名",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.user.mansion_name}
        </div>
      );
    },
  },
  {
    field: "delivery_method",
    headerName: "配送方法",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.delivery_method}
        </div>
      );
    },
  },
  {
    field: "delivery_day",
    headerName: "配送日",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.delivery_day}
        </div>
      );
    },
  },
  {
    field: "delivery_time",
    headerName: "配送時間",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.delivery_time}
        </div>
      );
    },
  },
  {
    field: "payment_method",
    headerName: "支払い方法",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.delivery_time}
        </div>
      );
    },
  },
  {
    field: "credit_number",
    headerName: "カード番号",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.credit_number}
        </div>
      );
    },
  },
  {
    field: "credit_name",
    headerName: "カード名義人",
    width: 120,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.credit_name}
        </div>
      );
    },
  },
  {
    field: "cvc",
    headerName: "cvc",
    width: 120,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.cvc}
        </div>
      );
    },
  },
  {
    field: "expiry_data",
    headerName: "カード期限",
    width: 120,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.expiry_data}
        </div>
      );
    },
  },

];




//temporary data
export const userRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    status: "passive",
    age: 42,
  },
  {
    id: 3,
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "3snow@gmail.com",
    status: "pending",
    age: 45,
  },
  {
    id: 4,
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "active",
    age: 16,
  },
  {
    id: 5,
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "passive",
    age: 22,
  },
  {
    id: 6,
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "active",
    age: 15,
  },
  {
    id: 7,
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "passive",
    age: 44,
  },
  {
    id: 8,
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "active",
    age: 36,
  },
  {
    id: 9,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "pending",
    age: 65,
  },
  {
    id: 10,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "active",
    age: 65,
  },
];
