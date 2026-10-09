import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Cards/Card';
import { Badge } from '../components/Cards/Badge';
import { Button } from '../components/Buttons/Button';
import { quizzes } from '../data/quizzes';
import { Clock, FileText, CheckCircle, Play } from 'lucide-react';

export const Quizzes = () => {
  const [filter, setFilter] = useState('all');

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === 'all') return true;
    return quiz.status === filter;
  });

  const statusCounts = {
    all: quizzes.length,
    recommended: quizzes.filter(q => q.status === 'recommended').length,
    completed: quizzes.filter(q => q.status === 'completed').length,
    available: quizzes.filter(q => q.status === 'available').length,
  };

  const getStatusBadge = (status) => {
    const variants = {
      recommended: 'primary',
      completed: 'success',
      available: 'default',
    };
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      Easy: 'success',
      Medium: 'warning',
      Hard: 'danger',
    };
    return <Badge variant={variants[difficulty]}>{difficulty}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quizzes</h1>
        <p className="text-gray-600">
          Test your knowledge with personalized quizzes tailored to your learning needs.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{quizzes.length}</p>
            <p className="text-sm text-gray-600">Total Quizzes</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{statusCounts.recommended}</p>
            <p className="text-sm text-gray-600">Recommended</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{statusCounts.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-600">{statusCounts.available}</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'recommended', 'completed', 'available'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-1 text-xs opacity-75">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* Quiz List */}
      <div className="grid gap-4">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} hover>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                  {getStatusBadge(quiz.status)}
                  {getDifficultyBadge(quiz.difficulty)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{quiz.category}</span>
                  </div>
                </div>
                {quiz.concepts && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {quiz.concepts.map((concept, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {quiz.completed && quiz.score !== null && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{quiz.score}%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                )}
                <Link to={`/student/quizzes/${quiz.id}`}>
                  <Button size="sm">
                    {quiz.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Retake
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
