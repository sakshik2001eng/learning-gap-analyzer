import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Cards/Badge';
import { Button } from '../components/Buttons/Button';
import { students } from '../data/students';
import { Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';

export const TeacherStudents = () => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterGrade, setFilterGrade] = useState('all');

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                           student.email.toLowerCase().includes(search.toLowerCase());
      const matchesGrade = filterGrade === 'all' || student.grade === parseInt(filterGrade);
      return matchesSearch && matchesGrade;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getCompetencyBadge = (competency) => {
    if (competency >= 85) return <Badge variant="success">Excellent</Badge>;
    if (competency >= 70) return <Badge variant="warning">Good</Badge>;
    return <Badge variant="danger">Needs Help</Badge>;
  };

  const headers = [
    'Student',
    'Grade',
    'Competency',
    'Concepts Mastered',
    'Learning Gaps',
    'Streak',
    'Actions',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
        <p className="text-gray-600">
          Manage and monitor student progress and learning gaps.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Grades</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h) => {
                  const fieldMap = {
                    'Student': 'name',
                    'Grade': 'grade',
                    'Competency': 'competency',
                    'Concepts Mastered': 'conceptsMastered',
                    'Learning Gaps': 'learningGaps',
                    'Streak': 'currentStreak',
                    'Actions': null,
                  };
                  const field = fieldMap[h];
                  return (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600"
                      onClick={() => field && handleSort(field)}
                    >
                      <div className="flex items-center gap-1">
                        {h}
                        {sortField === field && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium mr-3">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{student.competency}%</span>
                      {getCompetencyBadge(student.competency)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.conceptsMastered}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.learningGaps}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.currentStreak} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/teacher/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
