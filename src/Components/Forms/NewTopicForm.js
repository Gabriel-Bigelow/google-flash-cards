import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { addTopic} from "../Topics/topicsSlice"

import './forms.css';

import flashCardsDefaultImage from '../../images/flashCardsDefaultImage.png';

export function NewTopicForm () {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const topicNameRef = useRef();
    const topicImageRef = useRef();

    function randomId () {
        return Math.floor(Math.random() * 1000 * 1000 * 1000 * 1000)
    }


    function handleSubmit (event) {
        event.preventDefault();

        let topicName = topicNameRef.current.value;
        let topicImage = topicImageRef.current.value;

        if (!topicImage) {
            topicImage = flashCardsDefaultImage;
        }
        
        dispatch(addTopic({id: randomId(), name: topicName, image: topicImage }));
        topicNameRef.current.value = "";
        topicImageRef.current.value = "";
        navigate('/topics/all');
    }

    return (
        <form className="new-form" onSubmit={handleSubmit}>
            <label>Topic Name 
                <input type="text" placeholder="Topic Name" ref={topicNameRef} required />
            </label>
            <label>Topic Image URL
                <input type="url" placeholder="Topic Image" ref={topicImageRef} />
            </label>
            <input id="add" type="submit" value="Add Topic"></input>
        </form>
    )
}