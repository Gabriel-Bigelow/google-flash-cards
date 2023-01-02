import { useLocation, useNavigate, useParams } from "react-router";


export function Quiz ({quizData, quizzes}) {
    const navigate = useNavigate();
    const pathname = useLocation();
    


    let { quizId } = useParams();

    let quiz;

    if (quizData) {
        quiz = quizData;
    } else if (quizzes[quizId]) {
        quiz = quizzes[quizId];
    } else {
        return navigate('/quizzes/all');
    }

    function selectQuizContainer () {
        if (pathname === '/quizzes/all') {
            navigate(`/quizzes/${quiz.id}`)
        }
    }

    function quizActions () {

    }

    function displayCards() {
        if (quizzes) {
            return quiz.cards.map(card => (
                <div className="flashcard" id={card.id}>
                    <div className="flashcard-front" onClick={flipCard}>{card.front}</div>
                    <div className="flashcard-back" onClick={flipCard}>{card.back}</div>
                </div>
            ))
        }
    }

    //flip animation when card is clicked;
    function flipCard (event) {
        const card = event.target.parentNode

        if (!card.style.transform) {
            card.style.transform = 'rotate3d(1, 0, 0, 0deg)';
        }
        card.style.transform === 'rotate3d(1, 0, 0, 0deg)' ? card.style.transform = 'rotate3d(1, 0, 0, 180deg)' : card.style.transform = 'rotate3d(1, 0, 0, 0deg)';
    }


    return (
        <div className="quiz-and-actions">
            <div className="quiz-container" id={quiz.id} onClick={selectQuizContainer}>
                <h3>{quiz.name}</h3>
                <div className="quiz-image-container">
                    <img className="quiz-image" src={quiz.image} alt="quiz preview pic" />
                </div>
            </div>
            {quizActions()}
            {displayCards()}
        </div>
    )
}