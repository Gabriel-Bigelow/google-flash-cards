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
            console.log(jsonResponse)
            for (let item of jsonResponse.items) {
                if (item.title.includes('Flash Cards app - Saved Data') && item.labels.trashed === false) {
                    console.log('found it');
                    console.log(item);
                    
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

        if (response.ok) {
            const jsonResponse = await response.json();
            return await jsonResponse;
        }
    }
)

export const overwriteDoc = createAsyncThunk(
    'google/overwriteDoc',
    async (params) => {
        const { id, revision, startIndex, endIndex, newData} = params;
        const accessToken = gapi.auth.getToken().access_token;
        const headers = {'Authorization': 'Bearer ' + accessToken}
        console.log(params);

        //send a delete request to the document specified by the id variable, using the batchUpdate deleteContentRange parameter
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
        
        //if delete request succeeds
        if (response.ok) {
            //send an insert request with the new data
            const insertResponse = await fetch(`https://docs.googleapis.com/v1/documents/${id}:batchUpdate`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    "requests": [
                        {
                            "insertText": {
                                "endOfSegmentLocation": {
                                    "segmentId": ""
                                },
                                "text": newData
                            }
                        }
                    ],
                    "writeControl": {
                    "targetRevisionId": revision
                    }
                })
            });

            //if the insert request succeeds
            if (insertResponse.ok) {
                //send a get request for the new version of the document at the specified ID
                const newDataResponse = await fetch(`https://docs.googleapis.com/v1/documents/${id}`, {
                    headers: headers
                })
                if (newDataResponse.ok) {
                    const jsonNewDataResponse = await newDataResponse.json();

                    //return new savedData
                    return jsonNewDataResponse;
                }
            }
        }
    }
);


export const deleteDoc = createAsyncThunk(
    'google/deleteDoc',
    async (id) => {
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
        savedData: { documentId: null, revisionId: null},
        searchedForDocument: false,
        dataParsed: false,
        pushUpdate: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;          
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setDataParsed: (state, action) => {
            state.dataParsed = action.payload;
        },
        setPushUpdate: (state, action) => {
            state.pushUpdate = action.payload;
        },
    },
    extraReducers: {
        //FIND FLASH CARDS SAVED DATA DOC
        [findDoc.fulfilled]: (state, action) => {
            state.savedData = action.payload;
            state.searchedForDocument = true;
        },
        [createDoc.fulfilled]: (state, action) => {
            state.savedData = action.payload;
        },

        //INSERT TEXT INTO FLASH CARDS SAVED DATA DOC
        [insertIntoDoc.rejected]: (state, action) => {
            console.log('rejected');
            console.log(action.payload);
        },
        [insertIntoDoc.fulfilled]: (state, action) => {
            console.log('fulfilled');
            console.log(action.payload);
        },

        //OVERWRITE DATA IN GOOGLE DOCS
        [overwriteDoc.rejected]: (state, action) => {
            console.log('rejected');
            console.log(action.payload);
        },
        [overwriteDoc.fulfilled]: (state, action) => {
            state.savedData = action.payload;
            state.pushUpdate = false;
        },

        //DELETE DATA DOCUMENT FILE
        [deleteDoc.rejected]: (state, action) => {
            console.log('rejected');
            console.log(action.payload);
        },
        [deleteDoc.fulfilled]: (state, action) => {
            state.savedData = action.payload;
        },
    }
})

export const { setUser, setAccessToken, setDataParsed, setPushUpdate } = googleSlice.actions;
export const selectUser = (state) => state.google.user;
export const selectAccessToken = (state) => state.google.accessToken;
export const selectSavedData = (state) => state.google.savedData;
export const selectSearchedForDocument = (state) => state.google.searchedForDocument;
export const selectDataParsed = (state) => state.google.dataParsed;
export const selectPushUpdate = (state) => state.google.pushUpdate;

export default googleSlice.reducer;