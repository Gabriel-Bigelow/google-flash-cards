import { NavLink, Outlet } from "react-router-dom"


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
                    //return <Topic topicData={topics[topic]} />
                })}
            </div>

            
            <Outlet />
        </div>
    )

}