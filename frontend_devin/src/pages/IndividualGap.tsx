import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Cards/Card';
import { SeverityBadge } from '../components/Cards/Badge';
import { Button } from '../components/Buttons/Button';
import { concepts } from '../data/concepts';
import { ArrowLeft, CheckCircle, XCircle, BookOpen, Target, TrendingUp } from 'lucide-react';

export const IndividualGap = () => {
  const { id } = useParams();
  const concept = concepts.find(c => c.id === parseInt(id));

  if (!concept) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Concept not found</h2>
        <Link to="/student/gaps" className="text-blue-600 hover:text-blue-700">
          Back to Learning Gaps
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/student/gaps">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Learning Gaps
        </Button>
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{concept.name}</h1>
          <SeverityBadge severity={concept.severity} />
        </div>
        <p className="text-gray-600">{concept.category}</p>
      </div>

      {/* Mastery Overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Current Mastery</p>
            <p className="text-4xl font-bold text-gray-900">{concept.mastery}%</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Target Mastery</p>
            <p className="text-4xl font-bold text-blue-600">{concept.targetMastery}%</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Severity</p>
            <p className="text-4xl font-bold text-gray-900 capitalize">{concept.severity}</p>
          </div>
        </Card>
      </div>

      {/* Detection Reason */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Why This Gap Was Detected</h2>
        <p className="text-gray-600">{concept.detectionReason}</p>
      </Card>

      {/* Known vs Missing Concepts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Known Concepts</h2>
          </div>
          {concept.knownConcepts.length > 0 ? (
            <div className="space-y-2">
              {concept.knownConcepts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No known concepts recorded.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Missing Concepts</h2>
          </div>
          {concept.missingConcepts.length > 0 ? (
            <div className="space-y-2">
              {concept.missingConcepts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-red-50 rounded-lg"
                >
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No missing concepts recorded.</p>
          )}
        </Card>
      </div>

      {/* Prerequisite Map */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Prerequisite Map</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {concept.knownConcepts.map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium"
              >
                {item}
              </div>
            ))}
            <div className="text-2xl text-gray-400">→</div>
            <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium border-2 border-red-300">
              {concept.name}
            </div>
            {concept.missingConcepts.length > 0 && (
              <>
                <div className="text-2xl text-gray-400">→</div>
                {concept.missingConcepts.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium"
                  >
                    {item}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Evidence from Answers */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidence from Your Answers</h2>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Quiz:</strong> {concept.category} Assessment
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Question:</strong> Solve for x in the equation...
            </p>
            <p className="text-sm text-gray-600">
              <strong>Your Answer:</strong> Incorrect - Missing understanding of {concept.missingConcepts[0] || 'key concept'}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Quiz:</strong> Practice Problems
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Question:</strong> Apply the concept to...
            </p>
            <p className="text-sm text-gray-600">
              <strong>Your Answer:</strong> Partial credit - Showed some understanding but missed key steps
            </p>
          </div>
        </div>
      </Card>

      {/* Recommended Next Steps */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Next Steps</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Review {concept.missingPrerequisites[0] || 'prerequisites'}</p>
              <p className="text-sm text-gray-600">Complete the foundational lessons before attempting this concept.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Watch tutorial videos</p>
              <p className="text-sm text-gray-600">Watch the recommended video lessons for {concept.name}.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Practice with exercises</p>
              <p className="text-sm text-gray-600">Complete 10-15 practice problems to reinforce understanding.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
              4
            </div>
            <div>
              <p className="font-medium text-gray-900">Take assessment quiz</p>
              <p className="text-sm text-gray-600">Test your knowledge with a focused quiz on this concept.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link to="/student/learning-path">
          <Button size="lg">
            <BookOpen className="w-5 h-5 mr-2" />
            Start Learning Path
          </Button>
        </Link>
        <Link to="/student/quizzes">
          <Button variant="outline" size="lg">
            <Target className="w-5 h-5 mr-2" />
            Take Practice Quiz
          </Button>
        </Link>
        <Link to="/student/progress">
          <Button variant="secondary" size="lg">
            <TrendingUp className="w-5 h-5 mr-2" />
            View Progress
          </Button>
        </Link>
      </div>
    </div>
  );
};
