import React, { useState } from 'react';
import { Card } from '../components/Cards/Card';
import { Button } from '../components/Buttons/Button';
import { Upload, FileText, Video, Link as LinkIcon, X } from 'lucide-react';

export const StudyMaterials = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: 'Linear Equations - Complete Guide',
      type: 'PDF',
      category: 'Algebra',
      uploadDate: '2024-01-15',
      size: '2.5 MB',
    },
    {
      id: 2,
      title: 'Quadratic Functions Tutorial',
      type: 'Video',
      category: 'Algebra',
      uploadDate: '2024-01-20',
      size: '45 MB',
    },
    {
      id: 3,
      title: 'Calculus Introduction',
      type: 'PDF',
      category: 'Calculus',
      uploadDate: '2024-02-01',
      size: '3.1 MB',
    },
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload logic here
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    // Handle file upload logic here
  };

  const handleDelete = (id) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'Video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'Link':
        return <LinkIcon className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials</h1>
        <p className="text-gray-600">
          Upload and manage study materials for your students.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Material</h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports PDF, Video, and other document formats
          </p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <label htmlFor="file-upload">
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Select Files
            </Button>
          </label>
        </div>

        {/* Material Details Form */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter material title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select category</option>
              <option value="Algebra">Algebra</option>
              <option value="Calculus">Calculus</option>
              <option value="Statistics">Statistics</option>
              <option value="Trigonometry">Trigonometry</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add a description for this material"
          ></textarea>
        </div>

        <div className="mt-4 flex justify-end">
          <Button>Upload Material</Button>
        </div>
      </Card>

      {/* Materials List */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Materials</h2>
        
        {materials.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No materials uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg">
                    {getTypeIcon(material.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{material.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{material.type}</span>
                      <span>•</span>
                      <span>{material.category}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                      <span>•</span>
                      <span>{material.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips for Effective Study Materials</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Organize materials by concept or category for easy navigation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Include clear titles and descriptions to help students find relevant content.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use a variety of formats (PDFs, videos, interactive content) to cater to different learning styles.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Regularly update materials to keep content current and relevant.</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
