import React, {useEffect, useState} from 'react';
import { Item} from '../../Interfaces/interfaces';
//import components
import Sidebar from './Sidebar/Sidebar';
import StoreItems from './StoreItems/StoreItems';
import About from './About/About';
import HomeLoadingOverlay from './HomeLoadingOverlay/HomeLoadingOverlay';
//import css
import './Home.css';
import upArrowImg from '../../Assets/icons/arrow-up-outline.svg';
import Aos from 'aos';
import "aos/dist/aos.css";
import { fetchAndHandleCart } from '../../Helpers/cart';

export default function Home(){
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [isSidebarExpanded,setIsSidebarExpanded] = useState<boolean>(false);
  const [cart,setCart] = useState<Item[]>([]);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  //menu states
  const [isFourPacksVisible, setIsFourPacksVisible] = useState<boolean>(false);
  const [isDozensVisible, setIsDozensVisible] = useState<boolean>(false);

  const handleMenuChange = function(type:string, isOpen:boolean) {
    if (type === 'dozens' && isOpen) {
      setIsDozensVisible(true);
      setIsFourPacksVisible(false);
    } else if (type === 'four packs' && isOpen) {
      setIsDozensVisible(false);
      setIsFourPacksVisible(true);
    } else {
      setIsDozensVisible(false);
      setIsFourPacksVisible(false);
    }
  };  

  //hide other menu options when one option is expanded
  useEffect(()=>{
    const buttonHeadingElements:any = document.querySelectorAll('.menu-button-heading');
    if (isDozensVisible || isFourPacksVisible && buttonHeadingElements){
      buttonHeadingElements.forEach((buttonHeadingElement:any)=>buttonHeadingElement.style.display='none');
    }else{
      buttonHeadingElements.forEach((buttonHeadingElement:any)=>buttonHeadingElement.style.display='flex');
    }
  },[isFourPacksVisible,isDozensVisible]);

  //handle initial page load
  useEffect(()=>{
    fetchAndHandleCart(setCart);
    //setup fade animation length
    Aos.init({duration: 2500});
  },[]);

  const scrollToID = function(elementID:string){
    const element: HTMLElement | null= document.getElementById(elementID);
    if (element) element.scrollIntoView();
  };

  if (!isPageLoaded){
    return(
      <HomeLoadingOverlay setIsPageLoaded={setIsPageLoaded} />
    );
  }else{
    return(
      <main className='home'>
        <Sidebar 
          cart={cart}
          isExpanded={isSidebarExpanded} 
          setIsExpanded={setIsSidebarExpanded}
          isSignedIn={isSignedIn}
          setIsSignedIn={setIsSignedIn}
        />
        <button onClick={()=>{scrollToID('nav')}} className='scroll-up-button'>
          <img src={upArrowImg} alt='scroll up'/>
        </button>
        <div className='home-content-wrapper' onClick={()=>{setIsSidebarExpanded(isSidebarExpanded===true ? false: false)}}>
          <About />
          <h3 data-aos='fade-in' className='our-menu-heading'>Our Menu</h3>
          <div className='our-menu'>
            {
              isFourPacksVisible===false ?
                <div data-aos='fade-in' className='menu-button-heading'>
                  <button onClick={()=>handleMenuChange('four packs',true)}>
                    Four Packs
                  </button>
                </div>
              :
              <div className='menu-left'>
                <div data-aos='fade-in'>
                  <button onClick={()=>handleMenuChange('four packs',false)}>Four Packs</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650c9f303843aa9fa7ae75cf')}}>Plain Four Pack</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650c9fb23843aa9fa7ae75d2')}}>Sesame Seeds Four Pack</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650c9f8d3843aa9fa7ae75d0')}}>Everything Four Pack</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650c9f9d3843aa9fa7ae75d1')}}>Cinnamon Raisin Four Pack</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650c9fc43843aa9fa7ae75d3')}}>Poppy Seeds Four Pack</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650c9fda3843aa9fa7ae75d5')}}>Blueberry Four Pack</button>
                </div>
              </div>
            }
            {
              isDozensVisible===false ?
                <div data-aos='fade-in' className='menu-button-heading'>
                  <button onClick={()=>{handleMenuChange('dozens',true)}}>Dozens</button>
                </div>
              :
              <div className='menu-right'>
                <div data-aos='fade-in'>
                  <button onClick={()=>{handleMenuChange('dozens',false)}}>Dozens</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650ca27e3843aa9fa7ae75d6')}}>Plain Dozen</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-6510e084bd5877435d3f2f40')}}>Sesame Seeds Dozen</button>
                </div>
                <div data-aos='fade-in'>
                  <button onClick={()=>{scrollToID('item-650ca2b83843aa9fa7ae75d7')}}>Everything Dozen</button>
                </div>
              </div>
            }
          </div>
          <h3 data-aos='fade-in' className='store-items-heading'>
            A Taste of New York
            <br />
            to Your Doorstep
          </h3>
          <StoreItems 
            isSignedIn={isSignedIn}
            cart={cart}
            setCart={setCart} />
        </div>
      </main>
    );
  };
};