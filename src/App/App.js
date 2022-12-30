import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Google, initializeGoogle, showLoginOptions } from '../util/Google';
import { createDoc, deleteFromDoc, deleteDoc, findDoc, insertIntoDoc, selectSavedData, selectSearchedForDocument, selectUser, updateDoc } from '../util/googleSlice';

import './App.css';
import '../util/google.css'

let savedData;

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const savedData = useSelector(selectSavedData);
  const searchedForDocument = useSelector(selectSearchedForDocument);


  useEffect(() => {
    initializeGoogle();

    if (searchedForDocument === false) {
      dispatch(findDoc());
    }

    if (searchedForDocument === true && !savedData) {
      dispatch(createDoc());
    }
  }, [user, savedData, searchedForDocument])

  function deleteFunction () {
    let docId;
    if (savedData.documentId) {
      docId = savedData.documentId;
    }
    dispatch(deleteDoc(docId));
  }

  function testFunction () {
    let id;
    let revision;
    if (savedData.documentId) {
      id = savedData.documentId;
    }
    if (savedData.revisionId) {
      revision = savedData.revisionId
    }

    dispatch(insertIntoDoc({id, revision, text:'Delete this: Test 123'}));
  }

  function deleteAllFromDoc () {
    let id = savedData.documentId;
    let revision = savedData.revisionId;
    let startIndex = savedData.body.content[1].startIndex;
    let endIndex = savedData.body.content[1].endIndex-1;

    dispatch(deleteFromDoc({id, revision, startIndex, endIndex}))
  }

  function deleteSomeFromDoc () {
    let id = savedData.documentId;
    let revision = savedData.revisionId;

    let textToRemove = 'this: test 12'
    let docBody = savedData.body.content[1].paragraph.elements[0].textRun.content.toLowerCase();

    textToRemove = textToRemove.toLowerCase();

    const startIndex = docBody.match(textToRemove)['index'] + 1 ;
    console.log(startIndex)
    const endIndex = startIndex + textToRemove.length;

    //let startIndex = savedData.body.content[1].paragraph.elements[0].textRun.match('');
    //let endIndex = savedData.body.content[1].endIndex-1;


    dispatch(deleteFromDoc({id, revision, startIndex, endIndex}))
  }


  return (
    <div className="App">
      <nav className="App-header">
        {showLoginOptions(user)}
      </nav>
      
      <button onClick={Google.getDocument}>get documents</button>
      <button onClick={deleteFunction}>Delete Document</button>
      <button onClick={testFunction}>insert into Document</button>
      <button onClick={deleteSomeFromDoc}>delete some from Document</button>
      <button onClick={deleteAllFromDoc}>delete all from Document</button>
    </div>
  );
}

export default App;
