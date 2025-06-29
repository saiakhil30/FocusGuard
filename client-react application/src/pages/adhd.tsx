import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, AlertCircle, CheckCircle, Heart, Phone, BookOpen, Lightbulb } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface ADHDProps {
  user: any;
}

export default function ADHD({ user }: ADHDProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Get latest assessment
  const { data: latestAssessment } = useQuery({
    queryKey: [`/api/adhd-assessments/user/${user?.id}/latest`],
    enabled: !!user?.id
  });

  // Submit assessment mutation
  const submitAssessment = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/adhd-assessments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/adhd-assessments/user/${user?.id}/latest`] });
      setShowResults(true);
      toast({
        title: "Assessment completed!",
        description: "View your results and recommendations below."
      });
    }
  });

  const adhdQuestions = [
    // Inattention symptoms (9 questions)
    "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
    "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
    "How often do you have problems remembering appointments or obligations?",
    "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
    "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
    "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
    "How often do you make careless mistakes when you have to work on a boring or difficult project?",
    "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
    "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
    // Hyperactivity-Impulsivity symptoms (9 questions)
    "How often do you leave your seat in meetings or other situations where you are expected to remain seated?",
    "How often do you feel restless or fidgety?",
    "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
    "How often do you find yourself talking too much when you are in social situations?",
    "When you're in a conversation, how often do you finish the sentences of the people you are talking to, before they can finish them themselves?",
    "How often do you have difficulty waiting your turn in situations when turn taking is required?",
    "How often do you interrupt others when they are busy?",
    "How often do you blurt out answers before questions have been completed?",
    "How often do you have trouble doing things quietly or in a calm manner?"
  ];

  const responseOptions = [
    { value: 0, label: "Never", color: "text-green-600" },
    { value: 1, label: "Rarely", color: "text-yellow-600" },
    { value: 2, label: "Sometimes", color: "text-orange-600" },
    { value: 3, label: "Often", color: "text-red-600" },
    { value: 4, label: "Very Often", color: "text-red-800" }
  ];

  const handleResponse = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = value;
    setResponses(newResponses);

    if (currentQuestion < adhdQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit assessment
      const totalScore = newResponses.reduce((sum, score) => sum + score, 0);
      const inattentionScore = newResponses.slice(0, 9).reduce((sum, score) => sum + score, 0);
      const hyperactivityScore = newResponses.slice(9, 18).reduce((sum, score) => sum + score, 0);
      
      let riskLevel = 'low';
      if (totalScore >= 24) riskLevel = 'high';
      else if (totalScore >= 14) riskLevel = 'moderate';

      const recommendations = generateRecommendations(riskLevel, inattentionScore, hyperactivityScore);

      submitAssessment.mutate({
        userId: user?.id,
        responses: newResponses,
        totalScore,
        inattentionScore,
        hyperactivityScore,
        impulsivityScore: Math.floor(hyperactivityScore / 2), // Simplified
        riskLevel,
        recommendations
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const managementTips = [
    {
      icon: Brain,
      title: "Focus Techniques",
      tips: [
        "Use the Pomodoro Technique (25 min work, 5 min break)",
        "Create a distraction-free workspace",
        "Break large tasks into smaller, manageable steps",
        "Use visual reminders and sticky notes"
      ]
    },
    {
      icon: Heart,
      title: "Emotional Regulation",
      tips: [
        "Practice deep breathing exercises",
        "Use mindfulness and meditation apps",
        "Regular physical exercise to manage hyperactivity",
        "Maintain consistent sleep schedule"
      ]
    },
    {
      icon: BookOpen,
      title: "Study Strategies",
      tips: [
        "Study in short, frequent sessions",
        "Use multi-sensory learning (visual, auditory, kinesthetic)",
        "Create study schedules with built-in flexibility",
        "Find study partners for accountability"
      ]
    },
    {
      icon: Lightbulb,
      title: "Daily Habits",
      tips: [
        "Use digital tools for reminders and organization",
        "Establish consistent daily routines",
        "Practice self-compassion and patience",
        "Celebrate small victories and progress"
      ]
    }
  ];

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free 24/7 crisis counseling"
    },
    {
      name: "ADHD Support Groups",
      number: "Contact local mental health services",
      description: "Peer support and resources"
    }
  ];

  if (latestAssessment && !showResults) {
    return <AssessmentResults assessment={latestAssessment} managementTips={managementTips} crisisResources={crisisResources} />;
  }

  if (showResults && submitAssessment.data) {
    return <AssessmentResults assessment={submitAssessment.data} managementTips={managementTips} crisisResources={crisisResources} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-900 flex items-center">
          <Brain className="text-purple-500 w-6 h-6 mr-2" />
          ADHD Care Assistant
        </h2>
      </div>

      <Tabs defaultValue="assessment" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mx-6 mt-4">
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="tips">Management</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="px-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                ADHD Self-Assessment
                <span className="text-sm font-normal text-gray-500">
                  {currentQuestion + 1} / {adhdQuestions.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={(currentQuestion / adhdQuestions.length) * 100} className="h-2" />
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-4">
                    <strong>Question {currentQuestion + 1}:</strong>
                  </p>
                  <p className="text-gray-900 font-medium">
                    {adhdQuestions[currentQuestion]}
                  </p>
                </div>

                <div className="space-y-2">
                  {responseOptions.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleResponse(option.value)}
                      variant="outline"
                      className={`w-full justify-start h-auto p-4 ${
                        responses[currentQuestion] === option.value ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          responses[currentQuestion] === option.value 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {responses[currentQuestion] === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <span className={`font-medium ${option.color}`}>
                          {option.label}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>

                {currentQuestion > 0 && (
                  <Button onClick={handlePrevious} variant="outline" className="w-full">
                    Previous Question
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="px-6 mt-4 space-y-4">
          {managementTips.map((category, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <category.icon className="w-5 h-5 mr-2 text-purple-500" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="px-6 mt-4 space-y-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                Crisis Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{resource.name}</h4>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                    <p className="text-sm font-mono text-red-600 mt-1">{resource.number}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Professional Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-2">When to Seek Professional Help</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Symptoms significantly impact daily life or work</li>
                    <li>• Difficulty maintaining relationships</li>
                    <li>• Academic or professional performance concerns</li>
                    <li>• Persistent feelings of overwhelm or anxiety</li>
                  </ul>
                </div>
                <Button className="w-full ios-gradient-blue">
                  Find ADHD Specialists Near You
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AssessmentResults({ assessment, managementTips, crisisResources }: any) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high': return 'High Risk - Professional consultation recommended';
      case 'moderate': return 'Moderate Risk - Consider professional guidance';
      default: return 'Low Risk - Continue monitoring symptoms';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="px-6 py-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`rounded-lg p-4 border ${getRiskColor(assessment.riskLevel)}`}>
                <h3 className="font-semibold mb-2">Risk Level: {assessment.riskLevel.toUpperCase()}</h3>
                <p className="text-sm">{getRiskLabel(assessment.riskLevel)}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-500">{assessment.totalScore}</div>
                  <div className="text-xs text-gray-500">Total Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">{assessment.inattentionScore}</div>
                  <div className="text-xs text-gray-500">Inattention</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{assessment.hyperactivityScore}</div>
                  <div className="text-xs text-gray-500">Hyperactivity</div>
                </div>
              </div>

              {assessment.recommendations && assessment.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {assessment.recommendations.map((rec: string, index: number) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {assessment.riskLevel === 'high' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-700">Professional Consultation Recommended</h4>
                  <p className="text-sm text-red-600">Consider speaking with a healthcare professional about your symptoms.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function generateRecommendations(riskLevel: string, inattentionScore: number, hyperactivityScore: number): string[] {
  const recommendations = [];

  if (inattentionScore > hyperactivityScore) {
    recommendations.push("Focus on organization and time management strategies");
    recommendations.push("Use tools like calendars, reminders, and task lists");
    recommendations.push("Break large tasks into smaller, manageable steps");
  } else {
    recommendations.push("Incorporate regular physical activity to manage energy");
    recommendations.push("Practice mindfulness and relaxation techniques");
    recommendations.push("Create structured routines and environments");
  }

  if (riskLevel === 'high') {
    recommendations.push("Consider consulting with a healthcare professional");
    recommendations.push("Explore therapy options like CBT or coaching");
  } else if (riskLevel === 'moderate') {
    recommendations.push("Monitor symptoms and their impact on daily life");
    recommendations.push("Implement self-management strategies consistently");
  }

  recommendations.push("Use the FocusGuard app's blocking features during study time");
  recommendations.push("Join ADHD support groups or online communities");

  return recommendations;
}
