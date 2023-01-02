import { NavLink, Outlet } from "react-router-dom"
import { Quiz } from "./Quiz"

import './quizzes.css';


export function Quizzes ({quizzes}) {



    return (
        <div>
            <div id="quizzes-header">
                <h2>Quizzes</h2>
                <NavLink to={`/quizzes/newQuiz`}>Create New Quiz</NavLink>
            </div>
            
            <div id="quizzes-body-container">
                {Object.keys(quizzes).map(quiz => {
                    console.log(quizzes[quiz])
                    console.log(quizzes[quiz].id)
                    return <NavLink to={`/quizzes/${quizzes[quiz].id}`} className="topic-quiz-link"><Quiz quizData={quizzes[quiz]} /> </NavLink>
                })}
            </div>

            
            <Outlet />
        </div>
    )

}