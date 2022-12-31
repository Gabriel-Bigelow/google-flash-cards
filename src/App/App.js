import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Google, initializeGoogle, showLoginOptions } from '../util/Google';
import { createDoc, deleteFromDoc, deleteDoc, findDoc, insertIntoDoc, selectSavedData, selectSearchedForDocument, selectUser } from '../util/googleSlice';

import './App.css';
import '../util/google.css'
import { Topics } from '../Components/Topics/Topics';
import { addTopic, selectTopics } from '../Components/Topics/topicsSlice';
import { Topic } from '../Components/Topics/Topic';
import { NewTopicForm } from '../Components/Forms/NewTopicForm';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const topics = useSelector(selectTopics);
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

  /*function addTopicFunc () {
    dispatch(addTopic({ id: '123', name: 'topicName'} ))
  }*/ 
  return (
    <Router>
      <nav className="app-header">
        <NavLink to="/topics/all">Topics</NavLink>
        <NavLink to="/quizzes">Quizzes</NavLink>
        {showLoginOptions(user)}
      </nav>
      <div id="app-body">
      <Routes>
        <Route path="/topics">
          <Route path="all" element={<Topics topics={topics} />} />
          <Route path="newTopic" element={<NewTopicForm/>} />
          <Route path=":topicId" element={<Topic topics={topics} showTopicActions={true} />} />
        </Route>
        
      </Routes>
        <button onClick={Google.getDocument}>get documents</button>
        <button onClick={deleteFunction}>Delete Document</button>
        <button onClick={testFunction}>insert into Document</button>
        <button onClick={deleteSomeFromDoc}>delete some from Document</button>
        <button onClick={deleteAllFromDoc}>delete all from Document</button>
      </div>
      
    </Router>
  );
}

function TopicsPaths () {
  const { pathname } = useLocation();

  return (
    <>
      <Topics /> 

      <Routes>
        <Route path=":topicid" element={<Topic />} />
      </Routes>
    </>
  )

}

export default App;