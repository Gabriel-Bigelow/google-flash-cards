import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeGoogle, showLoginOptions } from '../util/Google';
import { createDoc, findDoc, selectSavedData, selectSearchedForDocument, selectUser, overwriteDoc, selectPushUpdate, selectDataParsed, setDataParsed } from '../util/googleSlice';

import './App.css';
import '../util/google.css'
import { Topics } from '../Components/Topics/Topics';
import { parseTopicsFromGoogle, selectTopics } from '../Components/Topics/topicsSlice';
import { Topic } from '../Components/Topics/Topic';
import { NewTopicForm } from '../Components/Forms/NewTopicForm';
import { Quizzes } from '../Components/Quizzes/Quizzes';
import { parseQuizzesFromGoogle, selectQuizzes } from '../Components/Quizzes/quizzesSlice';
import { NewQuizForm } from '../Components/Forms/NewQuizForm';
import { Quiz } from '../Components/Quizzes/Quiz';
import { parseToGoogle } from '../util/parseSavedData';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const topics = useSelector(selectTopics);
  const quizzes = useSelector(selectQuizzes);
  const savedData = useSelector(selectSavedData);
  const searchedForDocument = useSelector(selectSearchedForDocument);
  const dataParsed = useSelector(selectDataParsed);
  const pushUpdate = useSelector(selectPushUpdate);
  

  initializeGoogle();


  useEffect(() => {
  
    let id = savedData ? savedData.documentId : undefined;
    let revision = savedData ? savedData.revisionId : undefined;

    function overwriteDocHelper (newData) {
      let id = savedData.documentId;
      let revision = savedData.revisionId;
      let startIndex = savedData.body.content[1].startIndex;
      let endIndex = savedData.body.content[savedData.body.content.length-1].endIndex-1;
  
      dispatch(overwriteDoc({id, revision, startIndex, endIndex, newData}));
    }


    if (!searchedForDocument) {
      dispatch(findDoc());
    }

    if (searchedForDocument && !savedData) {
      dispatch(createDoc());
      dispatch(findDoc());
    }

    if (searchedForDocument && savedData && !dataParsed) {
      dispatch(parseTopicsFromGoogle(savedData));
      dispatch(parseQuizzesFromGoogle(savedData));
      dispatch(setDataParsed(true));
    }

    if (id && revision && pushUpdate) {
      overwriteDocHelper(parseToGoogle(topics, quizzes));
    }
  }, [user, topics, quizzes, savedData, searchedForDocument, dataParsed, pushUpdate, dispatch]);













  return (
    <Router>
      <nav className="app-header">
        <NavLink to="/topics/all">Topics</NavLink>
        <NavLink to="/quizzes/all">Quizzes</NavLink>
        {showLoginOptions(user)}
      </nav>
      <div id="app-body">
        <Routes>
          <Route path="/quizzes" >
            <Route path="all" element={<Quizzes quizzes={quizzes} />} />
            <Route path="newQuiz" element={<NewQuizForm topics={topics} /> } />
            <Route path="newQuiz/:quizId" element={<NewQuizForm topics={topics} quizzes={quizzes} />} />
            <Route path="newQuiz/forTopic/:topicId" element={<NewQuizForm topics={topics} /> } />
            <Route path=":quizId" element={<Quiz quizzes={quizzes} />} />
          </Route>
          <Route path="/topics">
            <Route path="all" element={<Topics topics={topics} />} />
            <Route path="newTopic" element={<NewTopicForm/>} />
            <Route path="newTopic/:topicId" element={<NewTopicForm topics={topics}/>}/>
            <Route path=":topicId" element={<Topic topics={topics} showTopicActions={true} />} />
          </Route>
          
        </Routes>
      </div>
      
    </Router>
  );
}

export default App;
