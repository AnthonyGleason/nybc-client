import { getServerUrlPrefix } from "../Config/clientSettings";

export const requestCartToken = async function(){
  const response = await fetch(`${getServerUrlPrefix()}/api/shop/carts`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
  });
  const responseData = await response.json();
  if (responseData.cartToken){
    //return the cart session token
    return responseData.cartToken;  
  }
};

export const verifyLoginToken = async function(
  setIsSignedIn?:Function,
  setIsAdmin?:Function,
  setUserID?:Function
):Promise<boolean>{
  let isValid:boolean = false;
  //handle no login token is present
  if (!localStorage.getItem('loginToken')){
    if (setIsSignedIn) setIsSignedIn(false);
    if (setIsAdmin) setIsAdmin(false);
    return false;
  };
  try{
    const response = await fetch(`${getServerUrlPrefix()}/api/users/verify`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
      }
    });
    const responseData = await response.json();
    //handle 403 unauthorized
    if (response.ok===false || response.status===403){
      localStorage.removeItem('loginToken');
      isValid=false;
    }else{
      isValid=responseData.isValid;
    };
    if (setIsAdmin && responseData.isAdmin===true) setIsAdmin(true);
    if (setIsSignedIn) setIsSignedIn(isValid);
    if (setUserID) setUserID(responseData.userID);
    return isValid;
  }catch(err){
    console.log(err);
    if (setIsAdmin) setIsAdmin(false);
    return false;
  };
};

export const handleLogout = async function(setIsSignedIn?:Function){
  await fetch(`${getServerUrlPrefix()}/api/users/logout`,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
    }
  });
  if (setIsSignedIn) setIsSignedIn(false);
  //remove the token locally
  localStorage.removeItem('loginToken');
};

export const getMembershipTier = async function(
    setMembershipTier?:Function,
    setRemainingDeliveries?:Function,
    setExpirationDate?:Function
  ):Promise<string>{
  try{
    if (!localStorage.getItem('loginToken')) throw new Error('You are not signed in');
    const response = await fetch(`${getServerUrlPrefix()}/api/users/membershipLevel`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('loginToken')}`
      }
    });
    const responseData = await response.json();
    if (setMembershipTier) setMembershipTier(responseData.membershipLevel);
    if (setRemainingDeliveries) setRemainingDeliveries(responseData.remainingDeliveries);
    if (setExpirationDate) setExpirationDate(new Date(responseData.expirationDate).toDateString());
    return responseData.membershipLevel;
  }catch(err){
    console.log('You are not signed in, showing non-member pricing');
    if (setMembershipTier) setMembershipTier('Non-Member');
    return 'Non-Member';
  };
};