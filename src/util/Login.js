import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { CLIENT_ID } from './Google';
import { setAccessToken, setUser } from './googleSlice';

export function Login () {
    const dispatch = useDispatch();
    
    function onSuccess (res) {
        console.log("Successful login. Current user: ", res.profileObj);
        dispatch(setUser(res.profileObj));
        dispatch(setAccessToken(res.tokenObj));
    }

    function onFailure (res) {
        console.log("Failed login. res: ", res);
    }
    return (
        <div id="login">
            <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}