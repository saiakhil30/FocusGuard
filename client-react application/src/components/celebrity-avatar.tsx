interface CelebrityAvatarProps {
  avatar: {
    id: string;
    name: string;
    image: string;
    personality: string;
    specialty?: string[];
    greeting?: string;
    voice?: {
      tone: string;
      pace: string;
      accent: string;
    };
  };
  isSelected: boolean;
  onSelect: () => void;
  isAnimating?: boolean;
}

export default function CelebrityAvatar({ avatar, isSelected, onSelect }: CelebrityAvatarProps) {
  return (
    <div 
      className="flex-shrink-0 text-center cursor-pointer"
      onClick={onSelect}
    >
      <div className={`relative avatar-enter ${isSelected ? 'transform scale-110' : ''} transition-transform`}>
        <img
          src={avatar.image}
          alt={`${avatar.name} Avatar`}
          className={`w-12 h-12 rounded-full border-2 mb-1 object-cover ${
            isSelected ? 'border-blue-500' : 'border-gray-300'
          }`}
        />
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
      <p className={`text-xs font-medium ${isSelected ? 'text-blue-500' : 'text-gray-600'}`}>
        {avatar.name}
      </p>
    </div>
  );
}
