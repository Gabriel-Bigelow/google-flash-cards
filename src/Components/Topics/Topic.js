import { useLocation, useNavigate, useParams } from "react-router"
import './topics.css';

import { removeTopic } from "./topicsSlice";
import { useDispatch } from "react-redux";

export function Topic ({topicData, topics, showTopicActions}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let { topicId } = useParams();
    const { pathname } = useLocation();
    
    
    let topic;

    if (topicData) {
        topic = topicData;
    } else if (topics[topicId]){
        topic = topics[topicId];
    } else {
        return navigate('/topics/all');
    }

    function selectTopicContainer () {
        if (pathname === '/topics/all') {
            navigate(`/topics/${topic.id}`)
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

    return (
        <div id={topic.id}>
            <div id="topic-and-actions">
                <div className="topic-container" id={topic.id} onClick={selectTopicContainer}>
                    <h3>{topic.name}</h3>
                    <div className="topic-image-container">
                        <img className="topic-image" src={topic.image} />
                    </div>
                </div>
                {topicActions()}
            </div>
        </div>
    )
}