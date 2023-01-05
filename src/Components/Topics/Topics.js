import {
    Outlet,
    NavLink,
    useNavigate,
  } from 'react-router-dom';
import { Topic } from './Topic';


export function Topics ({topics}) {
    const navigate = useNavigate();

    function handleClick () {
        navigate('/topics/newTopic')
    }

    return (
        <div>
            <div id="topics-header">
                <h2>Topics</h2>
                <button onClick={handleClick}>Add Topic</button>
            </div>
            
            <div id="topics-body-container">
                {Object.keys(topics).map(topic => {
                    return <Topic topicData={topics[topic]} />
                })}
            </div>

            <Outlet />
        </div>
    )
}