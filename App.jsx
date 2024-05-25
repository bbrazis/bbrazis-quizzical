import React from 'react'
import Quiz from './Quiz'

export default function App() {
    const [quiz, setQuiz] = React.useState([])
    const [inProgress, setInProgress] = React.useState(false)
    const [answerState, setAnswerState] = React.useState(false)
    const [correctAnswers, setCorrectAnswers] = React.useState(0)
    const [difficulty, setDifficulty] = React.useState("easy")
    const [numberOfQuestions,setNumberOfQuestions] = React.useState(5)
    
    React.useEffect(()=>{
        if(inProgress === true && answerState !== true){
            console.log('fetching quiz data')
            getQuiz()
            
        }
        return ()=>{}
    },[inProgress,])
    
    React.useEffect(()=>{
        if(answerState){
            console.log('tallying correct answers')
            const quizQuestions = document.querySelectorAll('.quiz-item').entries()
            for(let [index,quizItem] of quizQuestions){
                const correct = quiz[index].correct_answer
                const labels = quizItem.querySelectorAll('label').entries()
                for(let [i, label] of labels){
                    const input = label.querySelector('input')
                    if(input.checked){
                        const quizClass = label.textContent === correct ? "correct" : "incorrect"
                        label.classList.add(quizClass)
                        if(quizClass === 'correct') setCorrectAnswers(prev => prev + 1)
                    } else if (label.textContent === correct){
                        label.classList.add('correct')
                    } else {
                        label.classList.add('not-selected')
                    }
                }
            }
        }
    },[answerState])
    
    async function getQuiz(){
        await fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&difficulty=${difficulty}&type=multiple`)
                .then(res => res.json())
                .then(data => {
                    if(data.response_code === 0){
                        const newArr = []
                        for(let dataItem of data.results){
                            let answersArr = []
                            answersArr.push(dataItem.correct_answer)
                            for(let ans of dataItem.incorrect_answers){
                                answersArr.push(ans)
                            }
                            
                            shuffle(answersArr)
                            
                            const item = {
                                question: dataItem.question,
                                correct_answer: dataItem.correct_answer,
                                answers: answersArr
                            }
                            newArr.push(item)
                        }
                        setQuiz(newArr)
                    }
            })
    }
    
    
    function startQuiz() {
        setInProgress(true)
    }
    
    function checkAnswers() {
        console.log('checking answers...')
        setAnswerState(true)
    }
    
    function resetQuiz() {
        setInProgress(false)
        setAnswerState(false)
        setCorrectAnswers(0)
        setQuiz([])
    }
    
    function shuffle(array) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }
    
    function handleChange(e){
        const value = e.target.value
        const target = e.target.id
        if(target === 'difficulty'){
            setDifficulty(value)
        } else if (target === 'question-amount'){
            setNumberOfQuestions(value)
        } else {
            // do nothing
        }
    }
    
    return (
        <div className="wrapper">
            {
                inProgress !== true &&
                <div className="container flex-vert container-centered">
                    <h1>Quizzical</h1>
                    <p>Everyone's favorite Quiz app!</p>
                    <div className="options-wrapper flex-vert">
                        <p>Below are some options for the quiz. After you make your changes, allow a little bit of time before starting the quiz to prevent any errors.</p>
                        <div className="quiz-options">
                            <div className="flex-vert">
                                <label htmlFor="difficulty">Difficulty</label>
                                <select id="difficulty" name="difficulty" onChange={handleChange} value={difficulty}>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div className="flex-vert">
                                <label htmlFor="question-amount">Number of Questions</label>
                                <input name="question-amount" id="question-amount" type="number" onChange={handleChange} value={numberOfQuestions} />
                            </div>
                        </div>
                    </div>
                    <button className="start-btn" onClick={startQuiz}>Start Quiz</button>
                </div>
            }
            {
                inProgress === true &&
                <Quiz
                    quiz={quiz}
                    answerState={answerState}
                    checkAnswers={checkAnswers}
                    correctAnswers={correctAnswers}
                    reset={resetQuiz}
                />
            }
            <img src="../images/blue-blob.svg" className="blob blue" alt="" />
            <img src="../images/yellow-blob.svg" className="blob yellow" alt="" />
        </div>
    )
}