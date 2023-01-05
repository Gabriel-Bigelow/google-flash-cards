import { useRef } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router";
import { addTopic} from "../Topics/topicsSlice"

import './forms.css';

import flashCardsDefaultImage from '../../images/flashCardsDefaultImage.png';
import { setPushUpdate } from "../../util/googleSlice";

export function NewTopicForm ({topics}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const topicId = useParams();
    let topic = {
        name: undefined,
        image: undefined
    };

    if (topicId.topicId) {
        topic = topics[topicId.topicId];
    }

    const topicNameRef = useRef();
    const topicImageRef = useRef();

    function randomId () {
        return Math.floor(Math.random() * 1000 * 1000 * 1000 * 1000)
    }


    function handleSubmit (event) {
        event.preventDefault();

        if (topicNameRef.current.value) {
            let topicName = topicNameRef.current.value;
            let topicImage = topicImageRef.current.value;
    
            if (!topicImage) {
                topicImage = flashCardsDefaultImage;
            }


            let newId;
            if (topic.id) {
                newId = topic.id;
            } else {
                newId = randomId();
            }

            dispatch(addTopic({id: newId, name: topicName, image: topicImage }));
            dispatch(setPushUpdate(true));
            topicNameRef.current.value = "";
            topicImageRef.current.value = "";
            
            navigate('/topics/all');
        }
    }

    return (
        <div id="new-topic-container">
            <form id="new-topic-form" className="new-form">
                <label>Topic Name 
                    <input type="text" placeholder="Topic Name" defaultValue={topic.name} ref={topicNameRef} required />
                </label>
                <label>Topic Image URL
                    <input type="url" placeholder="Topic Image" defaultValue={topic.image} ref={topicImageRef} />
                </label>
                <button type="submit" onClick={handleSubmit}>Add Topic</button>
                <Outlet/>
            </form>
        </div>
    )
}