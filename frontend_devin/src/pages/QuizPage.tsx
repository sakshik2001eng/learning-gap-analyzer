import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Cards/Card';
import { Button } from '../components/Buttons/Button';
import { quizQuestions, quizzes } from '../data/quizzes';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find(q => q.id === parseInt(id));
  const questions = quizQuestions[id] || [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correct++;
      }
    });
    return {
      correct,
      incorrect: questions.length - correct,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz not found</h2>
        <Button onClick={() => navigate('/student/quizzes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No questions available</h2>
        <Button onClick={() => navigate('/student/quizzes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/student/quizzes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>

        <Card className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h1>
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-5xl font-bold text-blue-600">{score.percentage}%</p>
              <p className="text-gray-600">Score</p>
            </div>
          </div>
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{score.correct}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{score.incorrect}</p>
              <p className="text-sm text-gray-600">Incorrect</p>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={() => {
              setSelectedAnswers({});
              setCurrentQuestion(0);
              setShowResults(false);
            }}>
              Retake Quiz
            </Button>
            <Button variant="outline" onClick={() => navigate('/student/gaps')}>
              View Learning Gaps
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Answers</h2>
          <div className="space-y-4">
            {questions.map((q, index) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        Question {index + 1}: {q.question}
                      </p>
                    </div>
                  </div>
                  <div className="ml-7 space-y-1">
                    {q.options.map((option, optIndex) => {
                      let optionClass = 'text-gray-700';
                      if (optIndex === q.correct) {
                        optionClass = 'text-green-700 font-medium';
                      } else if (optIndex === userAnswer && !isCorrect) {
                        optionClass = 'text-red-700 font-medium';
                      }
                      return (
                        <p key={optIndex} className={`text-sm ${optionClass}`}>
                          {optIndex === q.correct && '✓ '}
                          {optIndex === userAnswer && !isCorrect && '✗ '}
                          {option}
                        </p>
                      );
                    })}
                    {q.explanation && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/student/quizzes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quizzes
        </Button>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{quiz.duration} min</span>
        </div>
      </div>

      {/* Quiz Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>
        
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQ.id] === index;
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && currentQ.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Explanation:</strong> {currentQ.explanation}
            </p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestion === questions.length - 1 ? (
            <Button onClick={handleSubmit}>
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <Card>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Jump to Question</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => {
            const isAnswered = selectedAnswers[questions[index].id] !== undefined;
            const isCurrent = index === currentQuestion;
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestion(index);
                  setShowExplanation(false);
                }}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isAnswered
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
