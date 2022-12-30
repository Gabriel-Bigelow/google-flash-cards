import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { gapi } from "gapi-script";

export const createDoc = createAsyncThunk(
    'google/createDoc',
    async () => {
        const accessToken = gapi.auth.getToken().access_token;
        const headers = { 'Authorization': 'Bearer ' + accessToken };

        const response = await fetch(`https://docs.googleapis.com/v1/documents?title=Flash Cards app - Saved Data`, {
            method: "POST",
            headers: headers,
        })
        if (response.ok) {
            const jsonResponse = await response.json();
            return await jsonResponse;
        }
    }
)

export const findDoc = createAsyncThunk(
    'google/findDoc',
    async () => {
        let foundId;

        const accessToken = gapi.auth.getToken().access_token;
        const headers = { 'Authorization': 'Bearer ' + accessToken };

        const response = await fetch('https://www.googleapis.com/drive/v2/files', {
        headers: headers
        })

        if (response.ok) {
            const jsonResponse = await response.json();
            for (let item of jsonResponse.items) {
                if (item.title.includes('Flash Cards app - Saved Data') && item.labels.trashed === false) {
                    foundId = item.id;
                }
            }

            if (foundId) {
                const foundResponse = await fetch(`https://docs.googleapis.com/v1/documents/${foundId}`, {
                    headers: headers
                })
                if (foundResponse.ok) {
                    const jsonFoundResponse = await foundResponse.json();
                    return jsonFoundResponse;
                }
            }
        }

        return null;
    }
);
/*export const overwriteAllDoc = createAsyncThunk(
    'google/overwriteAllDoc',
    async (params) => {

    }
)*/

export const insertIntoDoc = createAsyncThunk(
    'google/insertIntoDoc',
    async (params) => {
        const { id, revision, text } = params;
        const accessToken = gapi.auth.getToken().access_token;
        const headers = {'Authorization': 'Bearer ' + accessToken}

        const response = await fetch(`https://docs.googleapis.com/v1/documents/${id}:batchUpdate`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                "requests": [
                    {
                        "insertText": {
                            "endOfSegmentLocation": {
                                "segmentId": ""
                            },
                            "text": text
                        }
                    }
                ],
                "writeControl": {
                "targetRevisionId": revision
                }
            })
        })
        console.log(response);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(await jsonResponse);
            return await jsonResponse;
        }

        
    }
)

export const deleteFromDoc = createAsyncThunk(
    'google/deleteFromDoc',
    async (params) => {
        const { id, revision, startIndex, endIndex} = params;
        const accessToken = gapi.auth.getToken().access_token;
        const headers = {'Authorization': 'Bearer ' + accessToken}

        const response = await fetch(`https://docs.googleapis.com/v1/documents/${id}:batchUpdate`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                "requests": [
                    {
                        "deleteContentRange": {
                            "range": {
                                "segmentId": "",
                                "startIndex": startIndex,
                                "endIndex": endIndex
                            },
                        }
                    }
                ],
                "writeControl": {
                "targetRevisionId": revision
                }
            })
        })
        console.log(response);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(await jsonResponse);
            return await jsonResponse;
        }
    }
);


export const deleteDoc = createAsyncThunk(
    'google/deleteDoc',
    async (id) => {
        console.log(id);
        const accessToken = gapi.auth.getToken().access_token;
        const headers = {'Authorization': 'Bearer ' + accessToken}

        const response = await fetch(`https://www.googleapis.com/drive/v2/files/${id}`, {
            method: "DELETE",
            headers: headers,
        })
        if (response.ok) {
            return null;
        }

        return response;
    }
)

const googleSlice = createSlice({
    name: 'google',
    initialState: {
        user: null,
        accessToken: null,
        savedData: null,
        searchedForDocument: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;          
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setSavedData: (state, action) => {
            state.savedData = action.payload;
        },
        setSearchedForDocument: (state, action) => {
            state.searchedForDocument = action.payload;
        }
    },
    extraReducers: {
        [findDoc.fulfilled]: (state, action) => {
            state.savedData = action.payload;
            state.searchedForDocument = true;
        },
        [createDoc.fulfilled]: (state, action) => {
            state.savedData = action.payload;
        },
        [insertIntoDoc.rejected]: (state, action) => {
            console.log('rejected');
            console.log(action.payload);
        },
        [insertIntoDoc.fulfilled]: (state, action) => {
            console.log('fulfilled');
            console.log(action.payload);
        },
        [deleteDoc.rejected]: (state, action) => {
            console.log(action.payload);
        },
        [deleteDoc.fulfilled]: (state, action) => {
            state.savedData = action.payload;
        },
    }
})

export const { setUser, setAccessToken, setSavedData, searchedForDocument } = googleSlice.actions;
export const selectUser = (state) => state.google.user;
export const selectAccessToken = (state) => state.google.accessToken;
export const selectSavedData = (state) => state.google.savedData;
export const selectSearchedForDocument = (state) => state.google.searchedForDocument;

export default googleSlice.reducer;