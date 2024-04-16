import React from 'react';
import { GoogleLogout } from "react-google-login";
import { useNavigate } from 'react-router-dom';
function GoogleLogoutButton() {
    const navigate = useNavigate();
    const clientId = "252165708469-qqf4vqi2u0ddf8qao2299o4oke0jt151.apps.googleusercontent.com";
    const onSuccess = () => {
        sessionStorage.removeItem('token');
        navigate('../login');
    }
    return (
        <div>
          <GoogleLogout
            clientId={clientId}
            buttonText={'Logout'}
            onLogoutSuccess={onSuccess}/>
        </div>
      )
}

export default GoogleLogoutButton;