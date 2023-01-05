import flashCardsDefaultImage from '../images/flashCardsDefaultImage.png';

export function parseToGoogle (topics, quizzes) {

    let topicsString = 'Topics\n';
    topicsString = parseTopicsTo(topics, topicsString);

    let quizzesString = 'Quizzes\n';
    quizzesString = parseQuizzesTo(quizzes, quizzesString);

    const savedDataString = `!~!~ START OF FLASHCARDS SAVED DATA DOCUMENT~!~!\n\n${topicsString}${quizzesString}!~!~ END OF FLASHCARDS SAVED DATA DOCUMENT~!~!`

    return savedDataString;
}

function parseTopicsTo (topics, topicsString) {
    for (let topic of Object.keys(topics)) {
        
        //add topics[topic].id to the string
        topicsString += `id: ${topic}\n`;

        //add topics[topic].name to the string
        topicsString += `name: ${topics[topic].name}\n`;

        if (topics[topic].image === flashCardsDefaultImage) {
            topicsString += 'image: defaultImage\n';
        } else {
            topicsString += `image: ${topics[topic].image}\n`
        }
        
        const quizIdsString = parseQuizIdsTo(topics[topic].quizIds);
        topicsString += `quizIds: ${quizIdsString}\n`;

        return topicsString;
    }
}

function parseQuizIdsTo (quizIds) {
    let quizIdString = ''

    for (let quizId of quizIds) {
        quizIdString += `${quizId}, `
    }
    quizIdString += '\n';

    return quizIdString;
}


function parseQuizzesTo (quizzes, quizzesString) {
    //parse quiz objects to string;
    for (let quiz of Object.keys(quizzes)) {

        //add quizzes[quiz].id to the string
        quizzesString += `id: ${quiz}\n`;
        
        //add quizzes[quiz].name
        quizzesString += `name: ${quizzes[quiz].name}\n`

        //add quizzes[quiz].topicId
        quizzesString += `topicId: ${quizzes[quiz].topicId}\n`

        //add quizzes[quiz].image
        if (quizzes[quiz].image === flashCardsDefaultImage) {
            quizzesString += `image: defaultImage\n`
        } else {
            quizzesString += `image: ${quizzes[quiz].image}\n`
        }

        const cardsString = parseCardsTo(quizzes[quiz].cards, quiz);
        quizzesString += `cards: ${cardsString}`;
    }
    return quizzesString;
}

function parseCardsTo(cards, quizId) {
    let cardsString = `openArrayBracketForQuiz${quizId}\n`;

    for (let card of Object.keys(cards)) {
        //add card.id
        cardsString += `{id: ${cards[card].id} `;

        //add card.front
        cardsString += `front: ${cards[card].front} `

        //add card.back
        cardsString += `back: ${cards[card].back}}`;

        cardsString += ',\n';
    }
    cardsString += `closingArrayBracketForQuiz${quizId}\n\n`;

    return cardsString;
}




const findQuizIds = /(?:\d+)/
const findCardId = /{id:\s*\s(\d+)\s/
const findCardFront = /\sfront:\s(.*)\sback/
const findCardBack = /\sback:\s(.*)},/

function returnLineData(line, start) {
    return line.slice(start, line.length-1);
}

export function parseFromGoogle (data) {
    const topics = {};
    const quizzes = {};

    let currentSection = "";

    let id;

    let inputtingCards = false;

    for (let i = 1; i < data.length-1; i++) {
        const line = data[i].paragraph.elements[0].textRun.content;

        if (line.slice(0, 6) === "Topics") {
            currentSection = "Topics"
        }

        if (currentSection === "Topics") {

            //create the topic object in the function's topics object, and add the id property to the specified topic
            if (line.slice(0, 4) === "id: ") {
                id = parseInt(returnLineData(line, 4));
                topics[id] = {};
                topics[id].id = id;
            }

            //add the name property to the specified topic
            if (line.slice(0, 6) === "name: ") {
                const name = returnLineData(line, 6);
                topics[id].name = name;
            }

            //add the image property to the specified topic
            if (line.slice(0, 7) === 'image: ') {
                if (returnLineData(line, 7) === 'defaultImage') {
                    topics[id].image = flashCardsDefaultImage;
                } else {
                    topics[id].image = returnLineData(line, 7);
                }
            }

            //add the quizIds array to the specified topic
            if (line.slice(0, 9) === "quizIds: ") {
                topics[id].quizIds = [];
                let lineArray = line;
                while (lineArray.match(findQuizIds)) {
                    topics[id].quizIds.push(parseInt(lineArray.match(findQuizIds)[0]));
                    lineArray = lineArray.replace(findQuizIds, '');
                }
            }
        }





        if (line.slice(0,7) === "Quizzes") {
            currentSection = "Quizzes";
        }

        //parseQuizObjects
        if (currentSection === "Quizzes") {

            //create the quiz object in the function's quizzes object, and add the id property to the specified quiz
            if (line.slice(0, 4) === 'id: ') {
                id = parseInt(returnLineData(line, 4));
                quizzes[id] = {};
                quizzes[id].id = id;
            }

            //add the name property for the specified quiz
            if (line.slice(0, 6) === 'name: ') {
                const name = returnLineData(line, 6);
                quizzes[id].name = name;
            }

            //add the name property for the specified quiz
            if (line.slice(0, 9) === 'topicId: ') {
                const topicId = returnLineData(line, 9)
                if (topicId === ': ') {
                    quizzes[id].topicId = null;
                } else {
                    quizzes[id].topicId = parseInt(topicId);
                }
            }

            //add the image property for the specified quiz
            if (line.slice(0, 7) === 'image: ') {
                if (returnLineData(line, 7) === 'defaultImage') {
                    quizzes[id].image = flashCardsDefaultImage;
                } else {
                    quizzes[id].image = returnLineData(line, 7);
                }
            }

            //add the cards array for the specified quiz
            if (line === `closingArrayBracketForQuiz${id}\n`) {
                inputtingCards = false;
            }

            if (inputtingCards) {
                const card = {};
                card.id = parseInt(line.match(findCardId)[1]);
                card.front = line.match(findCardFront)[1];
                card.back = line.match(findCardBack)[1];
                
                quizzes[id].cards.push(card);  
            }

            if (line.slice(0, 7) === 'cards: ') {
                quizzes[id].cards = [];
                inputtingCards = true;
            }
        }
    }

    const savedData = {topics: topics, quizzes: quizzes}

    return savedData;
}