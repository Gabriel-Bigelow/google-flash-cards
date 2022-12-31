import { useSelector } from 'react-redux';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
    NavLink,
    useMatch,
    useLocation,
    useParams,
    useNavigate
  } from 'react-router-dom';
import { Topic } from './Topic';
import { selectTopics } from './topicsSlice';


export function Topics ({topics}) {
    const pathname = "/topics";
    const navigate = useNavigate();

    return (
        <div>
            <div id="topics-header">
                <h2>Topics</h2>
                <NavLink to={`/topics/newTopic`}>Create New Topic</NavLink>
            </div>
            
            <div id="topics-body-container">
                {Object.keys(topics).map(topic => {
                    console.log(topics[topic])
                    return <Topic topicData={topics[topic]} />
                })}
            </div>

            
            <Outlet />
        </div>
    )
}