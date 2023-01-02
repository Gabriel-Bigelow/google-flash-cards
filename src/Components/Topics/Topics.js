import {
    Outlet,
    NavLink,
  } from 'react-router-dom';
import { Topic } from './Topic';


export function Topics ({topics}) {

    return (
        <div>
            <div id="topics-header">
                <h2>Topics</h2>
                <NavLink to={`/topics/newTopic`}>Create New Topic</NavLink>
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