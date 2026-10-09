import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Cards/Card';
import { KPICard } from '../components/Cards/Card';
import { SeverityBadge } from '../components/Cards/Badge';
import { Button } from '../components/Buttons/Button';
import { students } from '../data/students';
import { concepts } from '../data/concepts';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, TrendingUp, Target, Flame, Download } from 'lucide-react';
import { downloadCsv } from '../utils/csv';
import { buildStudentReport } from '../utils/reports';

export const TeacherStudentDetail = () => {
  const { id } = useParams();
  const student = students.find(s => s.id === parseInt(id));

  const [confirmedGaps, setConfirmedGaps] = useState([]);
  const [rejectedGaps, setRejectedGaps] = useState([]);

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Student not found</h2>
        <Link to="/teacher/students" className="text-blue-600 hover:text-blue-700">
          Back to Students
        </Link>
      </div>
    );
  }

  const studentGaps = concepts.filter(c => c.mastery < 80);
  const pendingGaps = studentGaps.filter(
    c => !confirmedGaps.includes(c.id) && !rejectedGaps.includes(c.id)
  );

  const handleConfirmGap = (gapId) => {
    setConfirmedGaps([...confirmedGaps, gapId]);
  };

  const handleRejectGap = (gapId) => {
    setRejectedGaps([...rejectedGaps, gapId]);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/teacher/students">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </Link>

      {/* Student Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl">
            {student.avatar}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h1>
            <p className="text-gray-600">{student.email}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>Grade {student.grade}</span>
              <span>•</span>
              <span>Enrolled: {student.enrolledDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Competency"
          value={`${student.competency}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="+5% from last month"
        />
        <KPICard
          title="Concepts Mastered"
          value={student.conceptsMastered}
          icon={Target}
          trend="up"
          trendValue="+2 this week"
        />
        <KPICard
          title="Learning Gaps"
          value={student.learningGaps}
          icon={Target}
          trend="down"
          trendValue="-1 from last week"
        />
        <KPICard
          title="Current Streak"
          value={`${student.currentStreak} days`}
          icon={Flame}
          trend="up"
          trendValue="Keep it up!"
        />
      </div>

      {/* AI-Identified Learning Gaps */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          AI-Identified Learning Gaps
        </h2>
        <p className="text-gray-600 mb-4">
          Review and confirm or reject the learning gaps identified by the AI system.
        </p>

        {pendingGaps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>All learning gaps have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingGaps.map((gap) => (
              <div key={gap.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{gap.name}</h3>
                      <SeverityBadge severity={gap.severity} />
                    </div>
                    <p className="text-sm text-gray-600">{gap.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{gap.mastery}%</p>
                    <p className="text-xs text-gray-500">Mastery</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  <strong>Detection Reason:</strong> {gap.detectionReason}
                </p>

                {gap.missingPrerequisites.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Missing Prerequisites:</p>
                    <div className="flex flex-wrap gap-1">
                      {gap.missingPrerequisites.map((prereq, index) => (
                        <span
                          key={index}
                          className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded"
                        >
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleConfirmGap(gap.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRejectGap(gap.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Confirmed Gaps */}
      {confirmedGaps.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Confirmed Learning Gaps
          </h2>
          <div className="space-y-2">
            {confirmedGaps.map((gapId) => {
              const gap = concepts.find(c => c.id === gapId);
              return gap ? (
                <div key={gapId} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{gap.name}</p>
                    <p className="text-sm text-gray-600">{gap.category}</p>
                  </div>
                  <span className="text-sm text-green-600">Confirmed</span>
                </div>
              ) : null;
            })}
          </div>
        </Card>
      )}

      {/* Rejected Gaps */}
      {rejectedGaps.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Rejected Learning Gaps
          </h2>
          <div className="space-y-2">
            {rejectedGaps.map((gapId) => {
              const gap = concepts.find(c => c.id === gapId);
              return gap ? (
                <div key={gapId} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{gap.name}</p>
                    <p className="text-sm text-gray-600">{gap.category}</p>
                  </div>
                  <span className="text-sm text-red-600">Rejected</span>
                </div>
              ) : null;
            })}
          </div>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recommended Actions
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Priority: Derivatives</p>
              <p className="text-sm text-gray-600">
                Student is struggling with calculus fundamentals. Recommend scheduling a one-on-one session.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Encourage Progress</p>
              <p className="text-sm text-gray-600">
                Student has maintained a 5-day streak. Send encouragement to keep momentum.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link to={`/teacher/gaps?student=${student.id}`}>
          <Button>
            View All Gaps
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => {
            const report = buildStudentReport(student);
            downloadCsv(report.filename, report.headers, report.rows);
          }}
        >
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          Generate Report
        </Button>
      </div>
    </div>
  );
};
