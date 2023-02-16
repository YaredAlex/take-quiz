import React from "react";
import "./quize.css";
export default function Quize() {
  const [quize, setQuize] = React.useState([]);
  const [startQuize, setStartQuize] = React.useState(false);
  const [answers, setAnswers] = React.useState([]);
  const [showResult, setShowResult] = React.useState(false);
  const [result, setResult] = React.useState(0);
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
        const quizes = data.results.map((quize) => {
          incorrectAnswer = [];
          incorrectAnswer.push(quize.correct_answer);
          incorrectAnswer.push(quize.incorrect_answers);
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
        setQuize(collQuize);
        setAnswers(correctAns);
      });
  }
  function selectedAnswer() {}
  //let btnColor=false

  //---------------------------To handle Button click----------------//
  const handleClick = (event, index) => {
    let result = document.querySelectorAll(`.q${index}`); //select every button that contains the same class
    result.forEach(function (element) {
      element.style.backgroundColor = ""; //sets background color to empty string
    });
    event.target.style.backgroundColor = "#D6DBF5"; //then the one which is selected,background color will be applyed
    userAnswer[index - 1] = event.target.innerHTML; //pushing user answer to useranswer array
  };

  //--------------------------------To handle submited answers(submition) --------------------//
  const checkAnswer = () => {
    let count = 0; //counting correct answers

    userAnswer.forEach(function (
      element,
      index //looping through useranswer to check if it is correct
    ) {
      //selecting all buttons according to their class //
      let q = document.querySelectorAll(`.q${index + 1}`);
      let a; //variable to be set when background color is found
      q.forEach(function (element) {
        if (element.style.backgroundColor !== "") {
          //checking background color why? long answer
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
            //checking if a is instance of DOM object else if given headace
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
    //btnColor=false
    // const Style={
    //     backgroundColor: {btnColor} ? 'green' :''
    //}

    return quize.map((quize, index) => (
      <div className="quize-question" key={index}>
        <h3>
          {index + 1}, {quize.question}
        </h3>
        {quize.incorrectAnswer.map((ans, index) => (
          <button
            onClick={(event) => handleClick(event, quize.questionId)} //passing event will help to identify which button is clicked
            // style={{ backgroundColor: { btnColor } === true ? "#D6DBF5" : "" }}// this is bad because it affect all buttons
            className={`choose btn q${quize.questionId}`} //this is very important with out this 'q${quize.questionId}' i can't group the answers accordingly
            key={index}
          >
            {ans}
          </button>
        ))}
      </div>
    ));
  }
  //finaly because this is limted time this is what i can do
  //there are some thing need should be done
  //like
  //1. user must select answer (forcing user to select answer)
  //2. after submiting you can change your answer which is bad you will see this because it is not coloring the corect answer
  //3. some of the answer contain special character (very not good to compare)
  //4. quize.js is becoming big file which is very very bad it should be break down to components
  //5. last but not least it is good
  //Time is our enemy this is what i can do rest is depend on you
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
                  prepareQuestion(); //my guss my be my be not
                }}
              >
                {"Play Again"}
              </button>
            ) : (
              <button className="startBtn " onClick={checkAnswer}>
                {"Check answers"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="start">
          <h1>Quizzical </h1>
          <p>Test Your General Knowledge let's start!</p>
          <button
            className="startBtn btn"
            onClick={() => setStartQuize(!startQuize)}
          >
            {" "}
            Start quiz
          </button>
        </div>
      )}
    </>
  );
}
