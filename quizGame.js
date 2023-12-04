let questionAndAnswers = document.querySelector('.questionAndAnswers')
let headerDiv =document.querySelector('.header')
let headerQuestionNum =document.querySelector('.questionsNum')
let timerDownDisplay= document.querySelector('.timerDownDisplay')
let nextBtn=document.querySelector('.next');
let dataGame;
let questionsNum;
let timerDownInterval;
let currentIndex= 0;
let score =0;
let totalTime=0;
// -------------getNewQuestion----------------------
function getNewQuestion () {
  let xhrRequest=new XMLHttpRequest()
  xhrRequest.open('GET','./quizData.json')
  xhrRequest.onreadystatechange = function () {
    if (this.readyState==4 && this.status==200) {
      dataGame= JSON.parse(xhrRequest.responseText)
      questionsNum= dataGame.length;
      addQuestionData(dataGame[currentIndex],questionsNum)
      nextBtn.addEventListener('click', nextQuestion)
    }
  }
  xhrRequest.send()
}
// -------------addQuestionData----------------------
function addQuestionData(question,count) {
  let divAnswer;
  let questionSyntax;
  clearInterval(timerDownInterval)
  if (currentIndex<count) {
    timeDown(question["timeLimit"])
    headerQuestionNum.innerHTML=`Question ${currentIndex+1} of ${questionsNum}`
    questionSyntax= document.createElement('h4') 
    questionSyntax.innerHTML= question['question']
    questionSyntax.className="questionSyntax"
    let answers =document.createElement('div')
    for(let i=0;i<4;i++) {
      divAnswer =document.createElement('div')
      divAnswer.className="divAnswer "
      let answerInput= document.createElement('input') 
      answerInput.type= 'radio'
      answerInput.name= 'answer'
      answerInput.id= `answer-${i+1}`
      let label = document.createElement('label')
      label.innerHTML= question['options'][i]
      label.htmlFor= `${answerInput.id}`
      answers.append(divAnswer)
      divAnswer.append(answerInput,label)
      answerInput.dataset.answer=question['options'][i]
      if (i==0) {
        answerInput.checked=true
      }
    }
    questionAndAnswers.append(questionSyntax,answers)
  }
}
//  ----------nextBtn------------------------------------------------------------------------------
function nextQuestion() {
  clearInterval(timerDownInterval)
  let rightAnswer= dataGame[currentIndex]['correctAnswer'];
  checkAnswer(rightAnswer)
  currentIndex++;
  if (currentIndex<questionsNum) {
  questionAndAnswers.innerHTML=' ';
  addQuestionData(dataGame[currentIndex],questionsNum)
  } else if (currentIndex==questionsNum) {
    questionAndAnswers.innerHTML=' ';
    if (score>questionsNum/2) {
      questionAndAnswers.innerHTML=`Congratulation, Your score is : ${score}`;
      questionAndAnswers.style.color="green"
    } else if (score<questionsNum/2) {
      questionAndAnswers.innerHTML=`Good Luck, Your score is : ${score}`;
      questionAndAnswers.style.color="red"
    }
    questionAndAnswers.className= 'qAA'
    nextBtn.remove()
    headerDiv.innerHTML=''
  }
}
//  ----------checkAnswer--------------------------------------------------------
function checkAnswer(rightAnswer) {
  let answerOptions= document.querySelectorAll('[name="answer"]')
  let choosenAnswer;
  for (let i=0;i<answerOptions.length;i++) {
    if (answerOptions[i].checked) {
      choosenAnswer= answerOptions[i].dataset.answer;
    }
  }
  if(choosenAnswer===rightAnswer) {
    score++
  }
}
// -----------------timeDown function----------------
function timeDown(duration) {
  if(currentIndex<questionsNum) {
    timerDownDisplay.innerHTML=`00:${duration}` 
    timerDownInterval=setInterval(function () {
      timerDownDisplay.innerHTML=`00:${duration}` 
      --duration;
      if (duration<0) {
        clearInterval(timerDownInterval)
        nextQuestion()
      }
      
    },1000)
  }

}

getNewQuestion ()