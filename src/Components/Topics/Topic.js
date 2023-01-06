import { useLocation, useNavigate, useParams } from "react-router"
import './topics.css';

import { removeTopic } from "./topicsSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectQuizzes } from "../Quizzes/quizzesSlice";
import { Quiz } from "../Quizzes/Quiz";
import { NavLink } from "react-router-dom";
import { setPushUpdate } from "../../util/googleSlice";

export function Topic ({topicData, topics, showTopicActions}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let { topicId } = useParams();
    const { pathname } = useLocation();
    const topic = topicId ? topics[topicId] : topicData;
    const quizzes = useSelector(selectQuizzes);

    function selectTopicContainer () {
        if (pathname === '/topics/all') {
            navigate(`/topics/${topic.id}`)
        } else {
            editTopic();
        }
    }

    function addQuiz () {
        navigate(`/quizzes/newQuiz/forTopic/${topicId}`)
    }

    function editTopic () {
        navigate(`/topics/newTopic/${topicId}`);
    }

    function deleteTopic () {
        let lessTopics = Object.keys(topics).filter(topic => topics[topic] !== topics[topicId])
        lessTopics = lessTopics.map(topicId => topics[topicId]);

        dispatch(removeTopic(lessTopics));
        dispatch(setPushUpdate(true));
        navigate('/topics/all');
    }

    function topicActions () {
        if (showTopicActions) {
            return (
                <div id="topic-actions">
                    <button className="topic-action" onClick={addQuiz}>Add Quiz</button>
                    <button className="topic-action" onClick={editTopic}>Change Name / Image</button>
                    <button className="topic-action" onClick={deleteTopic}>Delete Topic</button>
                </div>
            )
        }
    }

    function showQuizzes () {
        if (pathname !== '/topics/all') {
            return (
                <>  
                    <h2 id="topic-quizzes-header">Quizzes</h2>
                    <div id="topic-quizzes">
                        {topic.quizIds.map(quiz => {
                            return (
                                <NavLink key={`quiz-${quizzes[quiz].id}`} id={`quiz-link-${quizzes[quiz].id}`} to={`/quizzes/${quizzes[quiz].id}`} className="topic-quiz-link">
                                    <Quiz key={`quiz-${quizzes[quiz].id}`} id={`quiz-${quizzes[quiz].id}`} quizData={quizzes[quiz]} />
                                </NavLink>
                            )
                        })}

                    </div>
                </>
            )


        }
    }

    return (
        <div id={topic.id}>
            <div id="topic-and-actions">
                <div className="topic-container" id={topic.id} onClick={selectTopicContainer}>
                    <h3>{topic.name}</h3>
                    <div className="topic-image-container">
                        <img className="topic-image" alt="topic preview pic" src={topic.image} />
                    </div>
                </div>
                {topicActions()}
            </div>
            
            {showQuizzes()}

        </div>
    )
}