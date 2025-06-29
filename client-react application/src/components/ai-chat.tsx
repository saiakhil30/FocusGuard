import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Volume2, Globe, Bot } from "lucide-react";

interface AiChatProps {
  chats: any[];
  selectedAvatar: string;
  isLoading: boolean;
}

export default function AiChat({ chats, selectedAvatar, isLoading }: AiChatProps) {
  const avatarImages = {
    einstein: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    curie: 'https://images.unsplash.com/photo-1494790108755-2616b95494e1?w=40&h=40&fit=crop&crop=face',
    tesla: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    tutor: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  };

  const getAvatarName = (avatar: string) => {
    const names = {
      einstein: 'Einstein',
      curie: 'Marie Curie',
      tesla: 'Tesla',
      tutor: 'AI Tutor'
    };
    return names[avatar as keyof typeof names] || 'AI';
  };

  if (chats.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Bot className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Start a conversation</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload content or ask a question to begin learning with {getAvatarName(selectedAvatar)}
        </p>
        <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-600">
          💡 Try uploading a photo of your textbook, homework, or ask any question!
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96">
      <div className="space-y-4">
        {chats.map((chat, index) => (
          <div key={chat.id || index} className="flex items-start avatar-enter">
            <img
              src={avatarImages[chat.celebrityAvatar as keyof typeof avatarImages]}
              alt={`${getAvatarName(chat.celebrityAvatar)} avatar`}
              className="w-8 h-8 rounded-full mr-3 mt-1 object-cover"
            />
            <div className="bg-white rounded-xl rounded-tl-md p-3 shadow-sm flex-1 border border-gray-100">
              <p className="text-sm text-gray-900 mb-2">
                <strong>{getAvatarName(chat.celebrityAvatar)}:</strong> {chat.aiResponse}
              </p>
              
              {chat.hasAudio && (
                <div className="bg-blue-50 rounded-lg p-2 mb-2 flex items-center">
                  <Button size="sm" variant="ghost" className="text-blue-600 p-1">
                    <Volume2 className="w-4 h-4 mr-1" />
                    <span className="text-xs">Audio explanation</span>
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  <span>Available in 25+ languages</span>
                </div>
                <span>{new Date(chat.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start avatar-enter">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-3 mt-1"></div>
            <div className="bg-gray-100 rounded-xl rounded-tl-md p-3 flex-1">
              <div className="flex items-center text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="ml-2 text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
