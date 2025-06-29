import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, FileText, Keyboard, Upload, X, Image, File, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EnhancedUploadWidgetProps {
  onUpload: (contentType: string, content: any) => void;
  onClose: () => void;
  selectedAvatar: string;
}

export default function EnhancedUploadWidget({ onUpload, onClose, selectedAvatar }: EnhancedUploadWidgetProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textContent, setTextContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadTypes = [
    {
      id: 'photo',
      name: 'Photo/Image',
      icon: Image,
      description: 'Upload photos of notes, diagrams, or textbook pages',
      accept: 'image/*',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      icon: File,
      description: 'Upload study materials, research papers, or documents',
      accept: 'application/pdf',
      color: 'bg-red-50 border-red-200 text-red-800'
    },
    {
      id: 'text',
      name: 'Text Content',
      icon: MessageSquare,
      description: 'Type or paste questions, problems, or study content',
      accept: '',
      color: 'bg-green-50 border-green-200 text-green-800'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    let contentType = 'text';
    if (file.type.startsWith('image/')) {
      contentType = 'photo';
    } else if (file.type === 'application/pdf') {
      contentType = 'pdf';
    }

    try {
      const content = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        text: await extractTextFromFile(file)
      };

      onUpload(contentType, content);
      toast({
        title: "File uploaded successfully",
        description: `${selectedAvatar} is analyzing your content...`
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not process the file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type.startsWith('image/')) {
      // Simulate OCR - in real app, would use actual OCR service
      return `[Image content from ${file.name}] - This appears to be an image containing text or diagrams. I can help analyze and explain the visual content.`;
    } else if (file.type === 'application/pdf') {
      // Simulate PDF text extraction
      return `[PDF content from ${file.name}] - This is a PDF document. I can help analyze and explain the content within this document.`;
    } else {
      return file.name;
    }
  };

  const handleTextSubmit = () => {
    if (!textContent.trim()) {
      toast({
        title: "No content",
        description: "Please enter some text to analyze",
        variant: "destructive"
      });
      return;
    }

    onUpload('text', {
      text: textContent,
      type: 'text/plain'
    });
    
    toast({
      title: "Text submitted",
      description: `${selectedAvatar} is analyzing your question...`
    });
  };

  const getAvatarRecommendation = () => {
    const recommendations = {
      einstein: "Perfect for physics, mathematics, and complex theoretical questions",
      curie: "Ideal for chemistry, research methods, and scientific discovery",
      tesla: "Best for engineering, technology, and innovative problem-solving",
      tutor: "Great for UPSC/TSPSC prep and general study guidance"
    };
    return recommendations[selectedAvatar as keyof typeof recommendations] || "Ready to help with your studies";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Learning Content
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>{selectedAvatar}:</strong> {getAvatarRecommendation()}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!selectedType ? (
            <>
              <h3 className="font-medium text-gray-900 mb-4">Choose content type:</h3>
              <div className="grid gap-4">
                {uploadTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${type.color}`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-start gap-3">
                      <type.icon className="h-6 w-6 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{type.name}</h4>
                        <p className="text-sm opacity-80">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : selectedType === 'text' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Enter your question or content:</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>
                  ← Back
                </Button>
              </div>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Ask a question, paste study content, or describe what you need help with..."
                className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <Button onClick={handleTextSubmit} className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Text
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Upload {selectedType} file:</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>
                  ← Back
                </Button>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your {selectedType} here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={uploadTypes.find(t => t.id === selectedType)?.accept}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Maximum file size: 10MB</p>
                <p>• Supported formats: {selectedType === 'photo' ? 'JPG, PNG, GIF, WebP' : 'PDF documents'}</p>
                <p>• Content will be processed by AI for analysis</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="secondary" className="text-xs">
                Multi-language support
              </Badge>
              <Badge variant="secondary" className="text-xs">
                AI-powered analysis
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Voice explanations
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
