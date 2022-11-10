import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar';
import List from '../../components/table/List';
import './home.scss';

const Home = () => {


  return (
    <div className='home'>
      <Sidebar/>
      <div className='homeContainer'>
        <div className='listContainer'>
          <div className='listTitle'>Latest Transactions</div>
          <List/>
        </div>
      </div>
    </div>
  )
}

export default Home
