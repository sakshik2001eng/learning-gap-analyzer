import React from 'react';
import { Card } from '../components/Cards/Card';
import { Button } from '../components/Buttons/Button';
import { learningPath } from '../data/recommendations';
import { CheckCircle, Lock, Clock, Play, Circle } from 'lucide-react';

export const LearningPath = () => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in-progress':
        return <Play className="w-6 h-6 text-blue-600" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'in-progress':
        return 'border-blue-500 bg-blue-50';
      case 'locked':
        return 'border-gray-300 bg-gray-50 opacity-60';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const isButtonDisabled = (status) => {
    return status === 'locked';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Path</h1>
        <p className="text-gray-600">
          A personalized roadmap to help you master concepts step by step.
        </p>
      </div>

      {/* Path Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{learningPath.filter(c => c.status === 'completed').length}</p>
            <p className="text-sm opacity-90">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{learningPath.filter(c => c.status === 'in-progress').length}</p>
            <p className="text-sm opacity-90">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{learningPath.filter(c => c.status === 'locked').length}</p>
            <p className="text-sm opacity-90">Remaining</p>
          </div>
        </div>
      </div>

      {/* Learning Path Timeline */}
      <div className="space-y-6">
        {learningPath.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Connector Line */}
            {index < learningPath.length - 1 && (
              <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200"></div>
            )}

            <Card className={`ml-4 border-l-4 ${getStatusColor(item.status)}`}>
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(item.status)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.estimatedTime}</span>
                        </div>
                        {item.mastery > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{item.mastery}%</span>
                            <span>Mastery</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      disabled={isButtonDisabled(item.status)}
                      className={item.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {item.status === 'completed' ? 'Review' : item.status === 'in-progress' ? 'Continue' : 'Locked'}
                    </Button>
                  </div>

                  {/* Progress Bar for in-progress items */}
                  {item.status === 'in-progress' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.mastery}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Completion badge */}
                  {item.status === 'completed' && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips for Success</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Complete concepts in order to build a strong foundation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Review completed concepts regularly to maintain mastery.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Take quizzes after each concept to verify understanding.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Don't rush - focus on understanding rather than speed.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
