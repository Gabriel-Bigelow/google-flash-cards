import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { addTopic, selectTopics } from "../Topics/topicsSlice"

import './forms.css';

import flashCardsDefaultImage from '../../images/flashCardsDefaultImage.png';
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { addQuiz } from "../Quizzes/quizzesSlice";

export function NewQuizForm ({topics}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quizNameRef = useRef();
    const topicIdRef = useRef();

    const cardFront = useRef();
    const cardBack = useRef();

    let flashCards = [];

    let flashCardId = 0;

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

        const flashCardsArray = flashCards.map(card => {
            return {
                front: card.front,
                back: card.back
            }
        })

        dispatch(addQuiz({id: randomId(), name: quizNameRef.current.value, topicId: topicIdRef.current.value, cards: flashCardsArray}))

        quizNameRef.current.value = "";
        topicIdRef.current.value = "";

        navigate('/quizzes/all')
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
            document.getElementById('submitted-flash-cards').appendChild(cardContainer);
            
            
            
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
        <form className="new-form" onSubmit={handleSubmit}>
            <label for="quiz-name">Quiz Name
                <input id="quiz-name" type="text" placeholder="name" ref={quizNameRef} required/>
            </label>

            <label for="topic-name">Topic
                <select id="topic-names" ref={topicIdRef}>
                    <option value="">None</option>
                    {populateTopicsList()}
                </select>
            </label>

            <div className="card-input-container">
                <h2>New Flash Card</h2>
                <textarea className="card-input" placeholder="front" ref={cardFront} />
                <textarea className="card-input" placeholder="back" ref={cardBack} />
            </div>
            
            <button className="submit-button" onClick={addCard}>Add Card</button>

            <input className="submit-button" type="submit" value="Create Quiz" onClick={handleSubmit}/>
            
            <div id="submitted-flash-cards" />

        </form>
    )
}