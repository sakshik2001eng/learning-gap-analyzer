import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/Buttons/Button';
import { BlurText } from '../components/Animations/BlurText';
import { SpotlightCard } from '../components/Animations/SpotlightCard';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const cardStyle: React.CSSProperties = {
    '--mouse-x': `${mousePosition.x}px`,
    '--mouse-y': `${mousePosition.y}px`,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <BlurText delay={0}>Personalized Learning.</BlurText>
            <br />
            <BlurText delay={200} className="text-blue-600">Powered by Understanding.</BlurText>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered learning gap analysis that identifies your unique knowledge gaps and creates personalized learning paths to help you master any subject.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/student/dashboard')}
              className="w-full sm:w-auto"
            >
              Continue as Student
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/teacher/dashboard')}
              className="w-full sm:w-auto"
            >
              Continue as Teacher
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <SpotlightCard 
            className="text-center p-6 shadow-sm border border-gray-200"
            style={cardStyle}
            onMouseMove={handleMouseMove}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Learning Gap Detection
            </h3>
            <p className="text-gray-600">
              AI analyzes your answers to identify specific knowledge gaps and missing prerequisites.
            </p>
          </SpotlightCard>
          
          <SpotlightCard 
            className="text-center p-6 shadow-sm border border-gray-200"
            style={cardStyle}
            onMouseMove={handleMouseMove}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Personalized Learning
            </h3>
            <p className="text-gray-600">
              Get tailored recommendations and learning paths based on your unique needs and progress.
            </p>
          </SpotlightCard>
          
          <SpotlightCard 
            className="text-center p-6 shadow-sm border border-gray-200"
            style={cardStyle}
            onMouseMove={handleMouseMove}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Teacher Insights
            </h3>
            <p className="text-gray-600">
              Teachers get detailed analytics to understand class-wide and individual learning patterns.
            </p>
          </SpotlightCard>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {[
              { icon: BookOpen, label: 'Student Answer' },
              { icon: Brain, label: 'AI Analysis' },
              { icon: Target, label: 'Concept Detection' },
              { icon: TrendingUp, label: 'Knowledge Graph' },
              { icon: ArrowRight, label: 'Learning Gap' },
              { icon: BookOpen, label: 'Recommendation' },
            ].map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full mb-3">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{step.label}</p>
                </div>
                {index < 5 && (
                  <div className="hidden md:block text-blue-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Learning Gap Analyzer © 2024. Empowering personalized education through AI.
          </p>
        </div>
      </footer>
    </div>
  );
};
