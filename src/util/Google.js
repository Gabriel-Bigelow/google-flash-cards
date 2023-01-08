import { gapi } from 'gapi-script';
import { Login } from './Login';
import { Logout } from './Logout';


export const API_KEY = "AIzaSyDbb1j6_PRIBuZUdSnizs4jIW5s0zCA2P0";
export const CLIENT_ID = "477381734667-hdng9an695ii0b8jt2jidbkampkr1vr8.apps.googleusercontent.com";
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export function initializeGoogle () {
    gapi.load('client:auth2', Google.start);
}

export function showLoginOptions (user) {
    if (user === null) {
      return <Login/>
    } else {
      return <Logout/>
    }
  }

export const Google = {
    start () {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: SCOPES
        })
    },
}