import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import './forms.css';

import flashCardsDefaultImage from '../../images/flashCardsDefaultImage.png';
import { addQuiz } from "../Quizzes/quizzesSlice";

export function NewQuizForm ({topics}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quizNameRef = useRef();
    const topicIdRef = useRef();
    const quizImageRef = useRef();
    const cardFront = useRef();
    const cardBack = useRef();

    let flashCards = [];

    //used to give the HTML elements different IDs to be able to delete them
    let flashCardId = 0;

    //temporary data holder for flash card that is currently being edited.
    let flashCard = {
        id: flashCardId,
        front: null,
        back: null
    }

    //function to assign random id to quiz
    function randomId () {
        return Math.floor(Math.random() * 1000 * 1000 * 1000 * 1000)
    }

    //dispatches the addQuiz action, which attaches the flash cards to the quiz and the quiz to a specified top, if there is one.
    function handleSubmit (event) {
        event.preventDefault();


        let cardId = -1;
        const flashCardsArray = flashCards.map(card => {
            cardId++;
            return {
                id: cardId,
                front: card.front,
                back: card.back
            }
        })

        let quizImage;

        if (!quizImageRef.current.value) {
            quizImage = flashCardsDefaultImage;
        } else {
            quizImage = quizImageRef.current.value;
        }
        if (quizNameRef.current.value && flashCardsArray.length > 0) {

            dispatch(addQuiz({id: randomId(), name: quizNameRef.current.value, topicId: topicIdRef.current.value, image: quizImage, cards: flashCardsArray}))

        //quizNameRef.current.value = "";
        //topicIdRef.current.value = "";

        
            navigate('/quizzes/all')
        }
    }
    
    //populates the drop-down list to pick a topic and attach it to the quiz.
    function populateTopicsList () {
        return Object.keys(topics).map(topic => {
            return <option value={topics[topic].id}>{topics[topic].name}</option>
        })
    }

    //removes the card's representational HTML element, as well as the data object from the flashCards array. 
    function deleteCard (event) {
        event.preventDefault();
        const cardToDelete = document.getElementById(event.target.parentNode.id);

        document.getElementById('submitted-flash-cards').removeChild(cardToDelete);
        flashCards.splice(flashCards.findIndex(card => card.id === parseInt(cardToDelete.id) ), 1);
    }

    //adds a card to the flashCards array as well as a representational HTML element, along with the ability to remove that card.
    function addCard (event) {
        event.preventDefault();

        if (cardFront.current.value && cardBack.current.value) {
            flashCards.push(flashCard);


            flashCard.front = cardFront.current.value;
            flashCard.back = cardBack.current.value;

            const cardContainer = document.createElement('div');
            const front = document.createElement('p');
            const back = document.createElement('p');
            const removeButton = document.createElement('button');


            cardContainer.className = "flash-card-preview";
            cardContainer.id = flashCardId;


            front.className = 'card-front';
            front.innerHTML = "Front: " + flashCard.front;
            back.className = 'card-back';
            back.innerHTML = "Back: " + flashCard.back;

            removeButton.innerHTML = 'DELETE';
            removeButton.className = 'remove-button';
            removeButton.onclick = deleteCard;

            cardContainer.appendChild(front);
            cardContainer.appendChild(back);
            cardContainer.appendChild(removeButton)
            document.getElementById('submitted-flash-cards').prepend(cardContainer);
            
            flashCardId++;
            flashCard = {
                id: flashCardId,
                front: null,
                back: null
            }
            

            cardFront.current.value = "";
            cardBack.current.value = "";
        }   
    }

    return (
        <div id="new-quiz-container">
            <button id="submit" onClick={handleSubmit}>Add Quiz</button>
            <div id="form-and-cards">
                <form className="new-form" onSubmit={handleSubmit}>
                    <label>Quiz Name
                        <input id="quiz-name" type="text" placeholder="name (required)" ref={quizNameRef} required/>
                    </label>

                    <label>Topic
                        <select id="topic-names" ref={topicIdRef}>
                            <option value="">None</option>
                            {populateTopicsList()}
                        </select>
                    </label>

                    <label>Quiz Name
                        <input id="quiz-image" type="url" placeholder="Image URL" ref={quizImageRef} />
                    </label>
                    
                    <div className="card-input-container">
                        <h2>New Flash Card (1 or more required)</h2>
                        <textarea className="card-input" placeholder="front (required)" ref={cardFront} />
                        <textarea className="card-input" placeholder="back (required)" ref={cardBack} />
                    </div>
                    
                    <button id="add" onClick={addCard}>Add Card</button>
                </form>
                <div id="submitted-flash-cards" >
                    <h3>Added Flash Cards</h3>
                </div>
            </div>
        </div>
    )
}