import React from 'react'
import Quiz from './Quiz'
import blobBlue from './images/blue-blob.svg'
import blobYellow from './images/yellow-blob.svg'

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
    
    const customSelect = document.getElementsByClassName('custom-select')
    const customSelectLength = customSelect.length
    for(i = 0; i < customSelectLength; i++){
        const selElement = customSelect[i].getElementsByTagName('select')[0]
        const selElementLength = selElement.length
        /* for each element, create a new div that will act as the selected item */
        const selOption = createElement('div')
        selOption.setAttribute('class', 'select-selected')
        selOption.innerHTML = selElement.options[selElement.selectedIndex].innerHTML
        customSelect[i].appendChild(selOption)
        /* for each element, create a new div that will contain the option list */
        const optionList = document.createElement('div')
        optionList.setAttribute('class', 'select-items select-hide')
        for(j = 1; j < selElementLength; j++) {
            /* for each option in the original select element,
             create a new div that will act as an option item */
            const optionItem = document.createElement('div')
            optionItem.innerHTML = selElement.options[j].innerHTML
            optionItem.addEventListener('click', (e) => {
                /* when an item is clicked, update the original
                select box, and the select item */
                const selectBox = this.parentNode.parentNode.getElementsByTagName('select')[0]
                const selectBoxLength = selectBox.length
                const selectBoxPrevious = this.parentNode.previousSibling
                for(y = 0; y < selectBoxLength; y++){
                    if(selectBox.options[y].innerHTML === this.innerHTML) {
                        selectBox.selectedIndex = y
                        selectBoxPrevious.innerHTML = this.innerHTML
                        const sameAsSelected = this.parentNode.getElementsByClassName('same-as-selected')
                        const sameAsSelectedLength = sameAsSelected.length
                        for(k = 0; k < sameAsSelectedLength; k++){
                            sameAsSelected[k].removeAttribute('class')
                        }
                        this.setAttribute('class', 'same-as-selected')
                        break
                    }
                }
                selectBoxPrevious.click()
            })
            optionList.appendChild(optionItem)
        }
        customSelect[i].appendChild(optionList)
        selOption.addEventListener('click', (e) => {
            /* when the select box is clicked, close any other select boxes,
            and open/close the current select box */
            e.stopPropagation()
            closeAllSelect(this)
            this.nextSibling.classList.toggle('select-hide')
            this.classList.toggle('select-arrow-active')
        })
    }

    function closeAllSelect(elmnt) {
        /* a function that will close all select boxes in the document,
        except the current select box */
        const arrNo = []
        const selectItems = document.getElementsByClassName('select-items')
        const selectedItems = document.getElementsByClassName('select-selected')
        const selectItemsLength = selectItems.length
        const selectedItemsLength = selectedItems.length
        for(i = 0; i < selectedItemsLength; i++){
            if(elmnt === selectedItems[i]){
                arrNo.push(i)
            } else {
                selectedItems[i].classList.remove('select-arrow-active')
            }
        }
        for(i = 0; i < selectItemsLength; i++){
            if(arrNo.indexOf(i)){
                selectItems[i].classList.add('select-hide')
            }
        }
    }

    document.addEventListener('click', closeAllSelect)

    return (
        <main className="wrapper">
            {
                inProgress !== true &&
                <div className="container flex-vert container-centered">
                    <h1>Quizzical</h1>
                    <p className="subheading">Everyone's favorite Quiz app!</p>
                    <div className="options-wrapper flex-vert">
                        <h2>Below are some options for the quiz.</h2>
                        <div className="quiz-options">
                            <div className="flex-vert">
                                <label htmlFor="difficulty">Difficulty</label>
                                <div className="custom-select">
                                    <select id="difficulty" name="difficulty" onChange={handleChange} value={difficulty}>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
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
            <img src={blobBlue} className="blob blue" alt="" />
            <img src={blobYellow} className="blob yellow" alt="" />
        </main>
    )
}