import { gapi } from 'gapi-script';
import { grabSavedData } from '../App/App';
import { Login } from './Login';
import { Logout } from './Logout';


export const API_KEY = "AIzaSyDbb1j6_PRIBuZUdSnizs4jIW5s0zCA2P0";
export const CLIENT_ID = "477381734667-hdng9an695ii0b8jt2jidbkampkr1vr8.apps.googleusercontent.com";
//const clientSecret = "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";

//const DISCOVERY_DOC = 'https://docs.googleapis.com/$discovery/rest?version=v1';
const SCOPES = 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file';

let flashCardsDataID;
let savedData;

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

    async createDocument (title) {
        let accessToken = gapi.auth.getToken().access_token;
        const headers = { 'Authorization': 'Bearer ' + accessToken }

        try {
            const response = await fetch(`https://docs.googleapis.com/v1/documents?title=${title}`, {
                method: "POST",
                headers: headers,
            })
            if (response.ok) {
                const jsonResponse = await response.json();
                flashCardsDataID = jsonResponse.documentId;
            }
        }
        catch (error) {
            console.log(error);
        }

        
    },

    async getDocument () {
        let accessToken = gapi.auth.getToken().access_token;
        const headers = { 'Authorization': 'Bearer ' + accessToken }

        if (flashCardsDataID) {
            try {
                const response = await fetch(`https://docs.googleapis.com/v1/documents/${flashCardsDataID}`, {
                    headers: headers
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                } else {
                    Google.createDocument('Flash Cards app - Saved Data');                
                }
            }
            catch (err) {
                console.log(err);
            }
        } else {
            await Google.searchDocuments();
            Google.getDocument();
        }
    },

    async searchDocuments () {
        const accessToken = gapi.auth.getToken().access_token;
        const headers = { 'Authorization': 'Bearer ' + accessToken, 'Accept': 'application/json' };

        try {
            const response = await fetch('https://www.googleapis.com/drive/v2/files', {
            headers: headers
            })

            if (response.ok) {
                const jsonResponse = await response.json();
                for (let item of jsonResponse.items) {
                    if (item.title.includes('Flash Cards app - Saved Data') && item.labels.trashed === false) {
                        flashCardsDataID = item.id;
                    }
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    },
}