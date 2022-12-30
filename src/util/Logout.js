import { GoogleLogout } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import { CLIENT_ID } from './Google';
import { selectUser, setUser } from './googleSlice';

export function Logout () {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    function onSuccess () {
        dispatch(setUser(null));
        console.log("Successful logout");
    }

    return (
        <ul id="logout">
            <li><img id="user-profile-image" src={user.imageUrl}/></li>
            <li>{user.name}</li>
            <li><GoogleLogout
                clientId={CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            /></li>
        </ul>
    )
}