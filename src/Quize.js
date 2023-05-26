import React from "react";
import "./quize.css";
import swal from "sweetalert";
export default function Quize() {
  const [quize, setQuize] = React.useState([]);
  const [startQuize, setStartQuize] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);
  const [result, setResult] = React.useState(0);
  const [selected,setSelected] = React.useState([]);
  const [totalSelected,setTotalSelected] = React.useState(0);
  const [totalQuestion,setTotalQuestion] = React.useState(0);
  const userAnswer = new Array(10).fill("");

  React.useEffect(() => {
    const prep = async () => {
      await prepareQuestion();
    };
    prep();
  }, []);

  async function prepareQuestion() {
    fetch(
      "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => {
        const collQuize = [];
        let incorrectAnswer = [];
        const correctAns = [];
        let index = 0;
        let tmpselected = []
         data.results.forEach((quize) => {
          incorrectAnswer = [];
          incorrectAnswer.push(quize.correct_answer);
          incorrectAnswer.push(quize.incorrect_answers);
          selected.push(0);
          //****----This loop is for randomizing answer
          //****---if this loop is not written every answer will be choice A
          for (let i = 0; i < incorrectAnswer.length; i++) {
            let rand = Math.floor(Math.random() * (incorrectAnswer.length - i));
            let temp = incorrectAnswer[i];
            incorrectAnswer[i] = incorrectAnswer[rand];
            incorrectAnswer[rand] = temp;
          }
          //--End of randomizing
          correctAns.push(quize.correct_answer);
          // incorrectAnswer.push({isSelected:false})
          collQuize.push({
            question: quize.question,
            correctAnswer: quize.correct_answer,
            incorrectAnswer: incorrectAnswer.flat(),
            questionId: `${++index}`,
          });
        });
        setQuize([]);
        setSelected(tmpselected)
        setQuize(collQuize);
        setAnswers(correctAns);
        setTotalSelected(0);
        setTotalQuestion(index);
      });
  }
  //---------------------------To handle Button click----------------//
  const selectAnswer = (event, index) => {
    if(selected[index]!==1){
        selected[index] = 1;
        setTotalSelected(c=> c +=1)
    }
    let result = document.querySelectorAll(`.q${index}`); //select every button that contains the same class
    result.forEach(function (element) {
      element.style.backgroundColor = ""; //sets background color to empty string
    });
    event.target.style.backgroundColor = "#D6DBF5"; //then the one which is selected,background color will be applyed
    userAnswer[index - 1] = event.target.innerHTML; //pushing user answer to useranswer array
  };

  //--------------------------------To handle submited answers(submition) --------------------//
  const checkAnswer = () => {
    if(totalSelected!==totalQuestion){
      swal("Select All","Please select all questions","warning")
      return;
    }
    let count = 0; //counting correct answers
    userAnswer.forEach(function ( element,index ) {
      let q = document.querySelectorAll(`.q${index + 1}`);
      let a;
      q.forEach(function (element) {
        if (element.style.backgroundColor !== "") {
          a = element;
        }
        if (element.innerHTML === answers.at(index)) {
          //seting background color to green color
          element.style.backgroundColor = "#5cb85c";
        }
      });
      //------------ function to check if userAnswer matchs the answer -------------//
      function check() {
        if (a instanceof Element)
          if (answers.at(index).localeCompare(a.innerHTML) !== 0) {
            //check if they are not equal!
            a.style.backgroundColor = "rgba(217, 83, 79,0.4)";
          } else count++; //count they are equal increment count
      }
      check(); //calling check function
      setResult(count);
      setShowResult(true);
    });
    console.log("result is count ", count); //console loging result
  };

  //----------------------Generating Quize-------------------------//
  function generateQuizeHtml() {
    return quize.map((quize, index) => (
      <div className="quize-question" key={index}>
        <h3>
          {index + 1}, {quize.question}
        </h3>
        {quize.incorrectAnswer.map((ans, index) => (
          <button
            onClick={(event) => selectAnswer(event, quize.questionId)} //passing event will help to identify which button is clicked
            // style={{ backgroundColor: { btnColor } === true ? "#D6DBF5" : "" }}// this is bad because it affect all buttons
            className={`choose btn q${quize.questionId}`} //this is very important with out this 'q${quize.questionId}
            key={index}
          >
            {ans}
          </button>
        ))}
      </div>
    ));
  }
  return (
    <>
      {startQuize ? (
        <div className="question-container">
          {generateQuizeHtml()}
          <div className="checkAns">
            {showResult ? (
              <p style={{ marginLeft: 10, fontSize: "18px" }}>
                You scored {result}/10 correct answer
              </p>
            ) : (
              ""
            )}
            {showResult ? (
              <button
                className="startBtn "
                onClick={() => {
                  setShowResult(false);
                  setStartQuize(!startQuize);
                  prepareQuestion();
                }}
              >
                {"Play Again"}
              </button>
            ) : (
              <button className="startBtn " onClick={()=>checkAnswer()}>
                {"Check answers"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="start">
          <h1>Quizzone</h1>
          <p>Test Your General Knowledge let's start!</p>
          <button
            className="startBtn btn"
            onClick={() => setStartQuize(!startQuize)}
          >
            Start quiz
          </button>
        </div>
      )}
    </>
  );
}
