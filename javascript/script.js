const answerOptions=document.querySelector(".answer-options");
const nextQuestionBtn=document.querySelector(".next-question-btn");
const questionStatus=document.querySelector(".question-status");
const timerDisplay=document.querySelector(".time-duration");
const resultContainer=document.querySelector(".result-container");
const quizContainer=document.querySelector(".quiz-container");
const configContainer=document.querySelector(".config-container");



let currentQuestion=null;
const questionsIndexHistory=[];
let correctAnswersCount=0;

const QUIZ_TIME_LIMIT=5;
let timer=null;
let currentTime=QUIZ_TIME_LIMIT;

// intialize and start the timer for the current question
const startTimer=() =>{
    timer=setInterval(()=>{
        currentTime--;
        timerDisplay.textContent=`${currentTime}s`;
        if(currentTime<=0){
            clearInterval(timer);
            highlightCorrectAnswer();

            quizContainer.querySelector(".quiz-timer").style.background="#c31402";
             //disable all answer options after timer over
            answerOptions.querySelectorAll(".answer-option").forEach(option=>option.style.pointerEvents="none");
            nextQuestionBtn.style.visibility="visible";

        }

    },1000

    );
}
//clear and reset timer
const resetTimer=()=>{
    clearInterval(timer);
    currentTime=QUIZ_TIME_LIMIT;
    timerDisplay.textContent=`${currentTime}s`;
}

//display the quiz results and display the result container hiding quiz container
const showQuizResult=()=>{
    quizContainer.style.display="none";
    resultContainer.style.display="block";

    const resultText=`You have answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly. Great Effort..!`;
    document.querySelector(".result-message").innerHTML=resultText;
}

//fetch a random question based on the category
const getRandomQuestion=() =>{
    const categoryQuestions=questions.find(cat=>cat.category.toLowerCase()===quizCategory.toLowerCase()).questions;
  
    //show the results if all questions been completed
    if(questionsIndexHistory.length>=Math.min(categoryQuestions.length,numberOfQuestions)){
        return showQuizResult();
    }
   
    //filter out already asked questions and choose a random one
    const availableQuestions=categoryQuestions.filter((_,index)=> !questionsIndexHistory.includes(index));
    const randomQuestion=availableQuestions[Math.floor(Math.random()*availableQuestions.length)];
    questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
}

//highlight the correct answer option and add icon
const highlightCorrectAnswer=()=>{
    const correctOption=answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");
    const iconHTML=`<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend",iconHTML);
}

//handle the users answer selection
const handleAnswer=(option,answerIndex) =>{
    clearInterval(timer);
    const isCorrect=currentQuestion.correctAnswer === answerIndex;
    option.classList.add(isCorrect ? 'correct':'incorrect');
    !isCorrect ? highlightCorrectAnswer():correctAnswersCount++;

    //insert icon based on correctness
    const iconHTML=`<span class="material-symbols-rounded">${isCorrect ? 'check_circle':'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend",iconHTML);
   
    //disable all answer options after one option is selected
    answerOptions.querySelectorAll(".answer-option").forEach(option=>option.style.pointerEvents="none");
    nextQuestionBtn.style.visibility="visible";
}

//render the current question and its options in the quiz
const renderQuestion=()=>{
    currentQuestion=getRandomQuestion();
    if(!currentQuestion) return;
    console.log(currentQuestion);

    resetTimer();
    startTimer();
   
    // update UI
    answerOptions.innerHTML="";
    nextQuestionBtn.style.visibility="hidden";
    quizContainer.querySelector(".quiz-timer").style.background="#2e2e2e";
    document.querySelector(".question-text").textContent= currentQuestion.question;
    questionStatus.innerHTML=` <b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
   
     //create option <li> elements and append them and add click event listeners
    currentQuestion.options.forEach((option,index)=>{
        const li=document.createElement("li");
        li.classList.add("answer-option");
        li.textContent=option;
        answerOptions.appendChild(li);
        li.addEventListener("click",()=>handleAnswer(li,index));
    });
}

//start the quiz and render the random question
const startQuiz=()=>{
    configContainer.style.display="none";
    quizContainer.style.display="block";

    //update the quiz category and no of questions
    quizCategory=configContainer.querySelector(".category-option.active").textContent;
    numberOfQuestions=parseInt(configContainer.querySelector(".question-option.active").textContent);
    renderQuestion();
}
//highlight the selected option on click
document.querySelectorAll(".category-option,.question-option").forEach(option=>{
    option.addEventListener("click",()=>{
        option.parentNode.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

//reset the quiz and return to config container
const resetQuiz=()=>{
    resetTimer();
    correctAnswersCount=0;
    questionsIndexHistory.length=0;
    configContainer.style.display="block";
    resultContainer.style.display="none";

}
nextQuestionBtn.addEventListener("click",renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click",resetQuiz);

document.querySelector(".start-quiz-btn").addEventListener("click",startQuiz);