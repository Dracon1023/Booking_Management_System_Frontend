import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton({setUsername}) {
    const navigate = useNavigate();
    const clientId = "252165708469-qqf4vqi2u0ddf8qao2299o4oke0jt151.apps.googleusercontent.com";
    const success = (response) => {
        setUsername(response.profileObj.email);
        sessionStorage.setItem('token',response.accessToken);
        navigate("../homepage");
      };
      const failure = (error) => {
          console.log("Failure");
          console.log(error);
      };
     
    return (
        <div>
            <GoogleLogin 
                onSuccess={success} 
                onFailure={failure} 
                clientId={clientId}
                buttonText="Continue with Google"
                isSignedIn={true}
                cookiePolicy={'single_host_origin'}
                signInFlow="redirect"/>
        </div>
    )
}

export default GoogleLoginButton;