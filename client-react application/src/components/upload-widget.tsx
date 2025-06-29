import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, FileText, Keyboard, X, Upload } from "lucide-react";

interface UploadWidgetProps {
  onUpload: (contentType: string, content: any) => void;
  onClose: () => void;
}

export default function UploadWidget({ onUpload, onClose }: UploadWidgetProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'pdf' | 'text'>('photo');
  const [textContent, setTextContent] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Simulate file processing
    const contentType = file.type.startsWith('image/') ? 'photo' : 'pdf';
    const mockUrl = URL.createObjectURL(file);
    
    onUpload(contentType, {
      name: file.name,
      url: mockUrl,
      type: file.type
    });

    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleTextSubmit = () => {
    if (!textContent.trim()) return;
    
    onUpload('text', {
      text: textContent,
      length: textContent.length
    });
  };

  const tabs = [
    { id: 'photo', icon: Camera, label: 'Photo', accept: 'image/*' },
    { id: 'pdf', icon: FileText, label: 'PDF', accept: '.pdf' },
    { id: 'text', icon: Keyboard, label: 'Text', accept: undefined }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upload Content</CardTitle>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                variant={activeTab === tab.id ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                <tab.icon className="w-4 h-4 mr-1" />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'text' ? (
            <div className="space-y-4">
              <Textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your question or paste text content..."
                rows={6}
                className="resize-none"
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{textContent.length} characters</span>
                <Button onClick={handleTextSubmit} disabled={!textContent.trim()}>
                  Send Text
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {isUploading ? (
                  <div className="space-y-3">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto animate-bounce" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">{uploadProgress}%</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                      {tabs.find(t => t.id === activeTab)?.icon && (() => {
                        const IconComponent = tabs.find(t => t.id === activeTab)!.icon;
                        return <IconComponent className="w-6 h-6 text-gray-400" />;
                      })()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Upload {activeTab === 'photo' ? 'a photo' : 'a PDF document'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activeTab === 'photo' 
                          ? 'Photos of textbooks, handwritten notes, or problems'
                          : 'PDF documents, research papers, or study materials'
                        }
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept={tabs.find(t => t.id === activeTab)?.accept}
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                <strong>AI will analyze:</strong> Text content, mathematical equations, 
                diagrams, and provide detailed explanations in your chosen language.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
