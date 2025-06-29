import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, FileText, Keyboard, Volume2, Globe, Send, Plus, Bot } from "lucide-react";
import CelebrityAvatar from "@/components/celebrity-avatar";
import AiChat from "@/components/ai-chat";
import UploadWidget from "@/components/upload-widget";
import Animated3DAvatar from "@/components/animated-3d-avatar";
import EnhancedUploadWidget from "@/components/enhanced-upload-widget";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface AiLearnProps {
  user: any;
}

export default function AiLearn({ user }: AiLearnProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('einstein');
  const [inputText, setInputText] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [showAvatar, setShowAvatar] = useState(false);

  // Get AI chats for current avatar
  const { data: chats = [], isLoading } = useQuery({
    queryKey: [`/api/ai-chats/user/${user?.id}/avatar/${selectedAvatar}`],
    enabled: !!user?.id
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/ai-chats', data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ 
        queryKey: [`/api/ai-chats/user/${user?.id}/avatar/${selectedAvatar}`] 
      });
      setInputText('');
      
      // Show 3D avatar with response
      if (response?.aiResponse) {
        setCurrentResponse(response.aiResponse);
        setShowAvatar(true);
      }
      
      toast({
        title: "Message sent!",
        description: "AI is responding with voice and animation..."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    sendMessage.mutate({
      userId: user?.id,
      celebrityAvatar: selectedAvatar,
      contentType: 'text',
      originalContent: inputText,
      language: 'en'
    });
  };

  const handleContentUpload = (contentType: string, content: any) => {
    sendMessage.mutate({
      userId: user?.id,
      celebrityAvatar: selectedAvatar,
      contentType,
      originalContent: content.text || content.name,
      contentUrl: content.url,
      language: 'en'
    });
    setShowUpload(false);
  };

  const getSelectedAvatar = () => {
    return avatars.find(a => a.id === selectedAvatar) || avatars[0];
  };

  const handleAvatarComplete = () => {
    setShowAvatar(false);
    setCurrentResponse('');
  };

  const avatars = [
    {
      id: 'einstein',
      name: 'Albert Einstein',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      personality: 'Curious physicist who loves thought experiments and making complex concepts simple',
      specialty: ['Physics', 'Mathematics', 'Philosophy', 'Science'],
      greeting: 'Imagination is more important than knowledge. What shall we explore today?',
      voice: {
        tone: 'Thoughtful',
        pace: 'Measured',
        accent: 'German-Swiss'
      }
    },
    {
      id: 'curie',
      name: 'Marie Curie',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b95494e1?w=100&h=100&fit=crop&crop=face',
      personality: 'Determined scientist focused on discovery and breaking barriers',
      specialty: ['Chemistry', 'Physics', 'Research Methods', 'Perseverance'],
      greeting: 'Science is the key to understanding our world. Let us discover together!',
      voice: {
        tone: 'Inspiring',
        pace: 'Steady',
        accent: 'Polish-French'
      }
    },
    {
      id: 'tesla',
      name: 'Nikola Tesla',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      personality: 'Inventive engineer with boundless imagination and electrical expertise',
      specialty: ['Engineering', 'Electricity', 'Innovation', 'Future Technology'],
      greeting: 'The future will show whether my foresight is as accurate as I believe. What shall we invent?',
      voice: {
        tone: 'Energetic',
        pace: 'Quick',
        accent: 'Serbian'
      }
    },
    {
      id: 'tutor',
      name: 'AI Tutor Pro',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      personality: 'Patient teacher who adapts to your learning style and exam preparation needs',
      specialty: ['UPSC Prep', 'TSPSC Prep', 'Study Methods', 'All Subjects'],
      greeting: 'Ready to master your studies? I am here to guide you to success!',
      voice: {
        tone: 'Supportive',
        pace: 'Adaptive',
        accent: 'Neutral'
      }
    }
  ];

  const uploadOptions = [
    { type: 'photo', icon: Camera, label: 'Photo', color: 'text-blue-500' },
    { type: 'pdf', icon: FileText, label: 'PDF', color: 'text-red-500' },
    { type: 'text', icon: Keyboard, label: 'Text', color: 'text-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center">
          <Bot className="text-purple-500 w-6 h-6 mr-2" />
          AI Learning Assistant
        </h3>
      </div>

      {/* Upload Options */}
      <div className="px-6 py-4 bg-white">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {uploadOptions.map((option) => (
            <Button
              key={option.type}
              onClick={() => setShowUpload(true)}
              variant="outline"
              className="bg-gray-50 h-16 flex-col"
            >
              <option.icon className={`${option.color} w-6 h-6 mb-2`} />
              <p className="text-xs font-medium">{option.label}</p>
            </Button>
          ))}
        </div>

        {/* Celebrity Avatars */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-3">Choose your AI tutor:</p>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {avatars.map((avatar) => (
              <CelebrityAvatar
                key={avatar.id}
                avatar={avatar}
                isSelected={selectedAvatar === avatar.id}
                onSelect={() => setSelectedAvatar(avatar.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3D Avatar Display */}
      {showAvatar && currentResponse && (
        <div className="px-6 py-4 bg-gradient-to-br from-purple-50 to-blue-50">
          <Card className="border-2 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <Animated3DAvatar
                avatar={getSelectedAvatar()}
                message={currentResponse}
                isActive={showAvatar}
                onComplete={handleAvatarComplete}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Interface */}
      <div className="px-6 py-4 bg-white">
        <Card className="min-h-[400px]">
          <CardContent className="p-4">
            <AiChat 
              chats={chats || []}
              selectedAvatar={selectedAvatar}
              isLoading={isLoading || sendMessage.isPending}
            />

            {/* Input Area */}
            <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 mt-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowUpload(true)}
              >
                <Plus className="text-blue-500 w-5 h-5" />
              </Button>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask ${avatars.find(a => a.id === selectedAvatar)?.name} anything...`}
                className="flex-1 border-0 bg-transparent outline-none mx-3"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || sendMessage.isPending}
              >
                <Send className="text-blue-500 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Info */}
      <div className="px-6 py-4">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-2">AI Features</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Volume2 className="w-4 h-4 mr-2 text-blue-500" />
                Audio explanations with celebrity voices
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-green-500" />
                Support for 25+ languages
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Bot className="w-4 h-4 mr-2 text-purple-500" />
                Personality-driven explanations
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Upload Modal */}
      {showUpload && (
        <EnhancedUploadWidget
          onUpload={handleContentUpload}
          onClose={() => setShowUpload(false)}
          selectedAvatar={getSelectedAvatar().name}
        />
      )}
    </div>
  );
}
