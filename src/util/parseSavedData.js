import flashCardsDefaultImage from '../images/flashCardsDefaultImage.png';

export function parseToGoogle (topics, quizzes) {


    const quiz1 = Object.keys(quizzes);
    // console.log(quiz1);

    let quizzesString = 'Quizzes\n';

    //const startPropertyString = ''

    quizzesString = parseQuizzesTo(quizzes, quizzesString);

    // console.log(quizzesString);

    const savedDataString = `!~!~ START OF FLASHCARDS SAVED DATA DOCUMENT~!~!\n${quizzesString}\n!~!~ END OF FLASHCARDS SAVED DATA DOCUMENT~!~!`

    return savedDataString;
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





        //add quizzes[quiz].cards
        quizzesString += `cards: ${cardsString}`;

        quizzesString += '\n';
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
    cardsString += `closingArrayBracketForQuiz${quizId}\n`;

    return cardsString;
}





const findCardId = /{id:\s*\s(\d+)\s/
const findCardFront = /\sfront:\s(.*)\sback/
const findCardBack = /\sback:\s(.*)},/

function returnLineData(line, start) {
    return line.slice(start, line.length-1);
}

export function parseFromGoogle (data) {
    //console.log(data);

    const topics = {};
    const quizzes = {};

    let currentSection = "";

    let id;

    let inputtingCards = false;

    for (let i = 1; i < data.length-1; i++) {
        const line = data[i].paragraph.elements[0].textRun.content;
        //console.log(line);

        if (line.slice(0,7) === "Quizzes") {
            currentSection = "Quizzes";
        }

        //parseQuizObjects
        if (currentSection === "Quizzes") {

            //create the quiz object in the function's quizzes object, and add the id property to the specified quiz
            if (line.slice(0, 4) === 'id: ') {
                id = returnLineData(line, 4);
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
                const topicId = returnLineData(line, 7)
                quizzes[id].topicId = topicId;
                if (topicId === ': ') {
                    quizzes[id].topicId = null;
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
                //console.log(card);

                
                quizzes[id].cards.push(card);  
            }

            if (line.slice(0, 7) === 'cards: ') {
                //console.log('card here');
                quizzes[id].cards = [];
                inputtingCards = true;
            }



        }


    }

    const savedData = {topics: topics, quizzes: quizzes}



    return savedData;
}