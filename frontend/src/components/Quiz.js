import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./styles.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState("Geography");
  const [difficulty, setDifficulty] = useState("easy");
  const [quizStarted, setQuizStarted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackClass, setFeedbackClass] = useState("");
  const [canProceed, setCanProceed] = useState(false);
  const [countdownMessage, setCountdownMessage] = useState("");
  const [timer, setTimer] = useState(15);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false); // Tracks if time has run out

  const startCountdown = () => {
    setCountdownMessage("Show 1");
    setTimeout(() => {
      setCountdownMessage("Show 2");
      setTimeout(() => {
        setCountdownMessage("Ready!!");
        setTimeout(() => {
          setQuizStarted(true);
          setCountdownMessage("");
        }, 1000);
      }, 1000);
    }, 1000);
  };

  useEffect(() => {
    if (quizStarted) {
      const cancelTokenSource = axios.CancelToken.source();

      axios
        .get("http://localhost:5000/api/questions", {
          params: { category, difficulty },
          cancelToken: cancelTokenSource.token,
        })
        .then((response) => {
          const shuffledQuestions = response.data.results.map((question) => {
            const allAnswers = [
              ...question.incorrect_answers,
              question.correct_answer,
            ];
            const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
            return { ...question, shuffledAnswers };
          });
          setQuestions(shuffledQuestions);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            console.log("Request canceled", error.message);
          } else {
            console.error(error);
          }
        });

      return () => cancelTokenSource.cancel("Request canceled by cleanup.");
    }
  }, [quizStarted, category, difficulty]);

  const proceedToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setFeedbackMessage("");
    setFeedbackClass("");
    setCanProceed(false);
    setTimer(15);
    setIsAnswerSelected(false);
    setIsTimeUp(false); // Reset time-up state
  }, []);

  const handleTimeout = useCallback(() => {
    if (!isAnswerSelected) {
      setFeedbackMessage("⏳ Time's up! No option selected.");
      setFeedbackClass("timeout-message");
    }
    setIsTimeUp(true); // Set time-up state to true
    setTimeout(() => {
      proceedToNextQuestion();
    }, 2000);
  }, [isAnswerSelected, proceedToNextQuestion]);

  useEffect(() => {
    if (quizStarted && questions.length > 0 && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timerInterval);
    } else if (timer === 0) {
      handleTimeout();
    }
  }, [quizStarted, questions, timer, handleTimeout]);

  const checkAnswer = (answer) => {
    if (isAnswerSelected || isTimeUp) {
      setFeedbackMessage(
        isTimeUp
          ? "⏳ Time's up! You cannot select an answer now."
          : "You can only attempt one answer per question!"
      );
      setFeedbackClass("warning-message");
      return;
    }

    setIsAnswerSelected(true);
    const correctAnswer = questions[currentQuestionIndex].correct_answer;

    if (answer === correctAnswer) {
      setScore(score + 1);
      setFeedbackMessage("🎉 Correct Answer!");
      setFeedbackClass("correct-answer");
    } else {
      setFeedbackMessage(`❌ Oops! The correct answer was: ${correctAnswer}`);
      setFeedbackClass("incorrect-answer");
    }
    setCanProceed(true);
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setQuizStarted(false);
    setQuestions([]);
    setFeedbackMessage("");
    setFeedbackClass("");
    setCanProceed(false);
    setCountdownMessage("");
    setTimer(15);
    setIsAnswerSelected(false);
    setIsTimeUp(false);
  };

  const showCongratulationMessage = () => {
    if (score >= questions.length / 2) {
      return (
        <h2>
          🎉 Congratulations! 🎉 You've successfully completed the quiz! 🌟
          Final Score: {score}/{questions.length}
        </h2>
      );
    } else {
      return (
        <h2>
          😔 You can do better! Final Score: {score}/{questions.length}
        </h2>
      );
    }
  };

  return (
    <div className="quiz-app">
      <header>
        <h1>Welcome to the Quiz App</h1>
        <p>Select a category and difficulty to start!</p>
      </header>

      {!quizStarted ? (
        <section className="filters">
          <div className="category-icons">
            <label htmlFor="category">Category:</label>
            <div className="category-item">
              <i className="fas fa-globe" title="Geography"></i>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Geography">Anime Knowledge</option>
                <option value="Mathematics">Pop Culture Trivia</option>
              </select>
            </div>
          </div>

          <div className="difficulty-icons">
            <label htmlFor="difficulty">Difficulty:</label>
            <div className="difficulty-item">
              <i className="fas fa-snowflake" title="Easy"></i>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button id="start-quiz-btn" onClick={startCountdown}>
            Start Quiz
          </button>
          {countdownMessage && <h2>{countdownMessage}</h2>}
        </section>
      ) : (
        <div>
          {questions.length > 0 && currentQuestionIndex < questions.length ? (
            <div>
              <div className="question-container">
                <h2>{questions[currentQuestionIndex].question}</h2>
                <p>⏰ Time Remaining: {timer}s</p>
              </div>
              <div className="answers">
                {questions[currentQuestionIndex].shuffledAnswers.map(
                  (answer, index) => (
                    <button
                      key={`${answer}-${index}`}
                      onClick={() => checkAnswer(answer)}
                      disabled={isAnswerSelected || isTimeUp} // Disable button if time is up
                    >
                      {answer}
                    </button>
                  )
                )}
              </div>

              {feedbackMessage && (
                <div className={`feedback-message ${feedbackClass}`}>
                  {feedbackMessage}
                </div>
              )}

              <h3>Score: {score}</h3>

              {canProceed && (
                <button className="continue-btn" onClick={proceedToNextQuestion}>
                  Tap to Continue
                </button>
              )}
            </div>
          ) : currentQuestionIndex === questions.length && quizStarted ? (
            <div className="Congrat-message">
              {showCongratulationMessage()}
              <button onClick={resetQuiz}>Restart Quiz</button>
            </div>
          ) : null}
        </div>
      )}

      <footer>
        <p>&copy; 2024 Quiz App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Quiz;
