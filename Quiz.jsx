import React from 'react'
import he from 'he'

export default function Quiz(props) {
    const questionElements = props.quiz.map((questionEl,questNum) => {
        
        const question = he.decode(questionEl.question)
        
        const labelEls = questionEl.answers.map((ans, i) => {
            return (
                <label key={i}>
                    {he.decode(ans)}
                    <input type="radio" name={`answer-${questNum}`}/>
                </label>
            )
        })
        
        return (
            <div className="quiz-item flex-vert" key={questNum}>
                <h2>{question}</h2>
                <div className="answers">
                    {labelEls}
                </div>
            </div>
        )
    })
    
    return (
        <div className="container quiz-container">
            {questionElements}
            <div className="quiz-footer">
            {
                props.answerState !== true &&
                <button className="quiz-btn" onClick={props.checkAnswers}>Check answers</button>
            }
            {
                props.answerState === true &&
                <>
                    <p>You scored {props.correctAnswers}/{props.quiz.length} correct answers</p>
                    <button onClick={props.reset}>Play again</button>
                </>
            }
            </div>
        </div>
    )
}