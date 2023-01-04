import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { Quiz } from "./Quiz"

import './quizzes.css';


export function Quizzes ({quizzes}) {
    const navigate = useNavigate();

    function handleClick() {
        navigate('/quizzes/newQuiz');
    }

    return (
        <div>
            <div id="quizzes-header">
                <h2>Quizzes</h2>
                <button id="create-quiz-button" onClick={handleClick}>Add Quiz</button>
            </div>
            
            <div id="quizzes-body-container">
                {Object.keys(quizzes).map(quiz => {
                    return <NavLink key={`quiz-${quizzes[quiz].id}`} id={`quiz-link-${quizzes[quiz].id}`} to={`/quizzes/${quizzes[quiz].id}`} className="topic-quiz-link"><Quiz key={`quiz-${quizzes[quiz].id}`} id={`quiz-${quizzes[quiz].id}`} quizData={quizzes[quiz]} /> </NavLink>
                })}
            </div>

            
            <Outlet />
        </div>
    )

}