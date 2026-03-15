import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Image as ImageIcon,
  Link2,
  Smile,
  Hash,
  AtSign,
  Clock,
  Send,
  Sparkles,
  Trash2,
  Copy,
} from "lucide-react";

interface ContentEditorProps {
  onPublish?: (content: string, platforms: string[]) => void;
  onSchedule?: (content: string, platforms: string[], scheduledFor: Date) => void;
}

export default function ContentEditor({ onPublish, onSchedule }: ContentEditorProps) {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [scheduledFor, setScheduledFor] = useState<string>("");
  const [charCount, setCharCount] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState(false);

  const platforms = [
    { id: "facebook", name: "Facebook", color: "bg-blue-600" },
    { id: "instagram", name: "Instagram", color: "bg-pink-600" },
    { id: "twitter", name: "Twitter", color: "bg-sky-500" },
    { id: "linkedin", name: "LinkedIn", color: "bg-blue-700" },
    { id: "tiktok", name: "TikTok", color: "bg-black" },
    { id: "telegram", name: "Telegram", color: "bg-sky-400" },
  ];

  const emojis = ["😀", "😂", "❤️", "🔥", "👍", "🚀", "✨", "💡", "📱", "💰"];
  const hashtagSuggestions = ["#marketing", "#socialmedia", "#digital", "#business", "#startup"];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setCharCount(text.length);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setCharCount(charCount + emoji.length);
  };

  const addHashtag = (hashtag: string) => {
    setContent((prev) => prev + " " + hashtag);
    setCharCount(charCount + hashtag.length + 1);
  };

  const handlePublish = () => {
    if (content.trim() && selectedPlatforms.length > 0) {
      onPublish?.(content, selectedPlatforms);
      setContent("");
      setSelectedPlatforms([]);
      setMediaUrls([]);
      setCharCount(0);
    }
  };

  const handleSchedule = () => {
    if (content.trim() && selectedPlatforms.length > 0 && scheduledFor) {
      onSchedule?.(content, selectedPlatforms, new Date(scheduledFor));
      setContent("");
      setSelectedPlatforms([]);
      setMediaUrls([]);
      setScheduledFor("");
      setCharCount(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Editor */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="relative">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Escreva seu conteúdo aqui... Use #hashtags, @menções e emojis 😊"
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-4 focus:outline-none focus:border-blue-500 min-h-40 placeholder-slate-500 resize-none"
          />
          <div className="absolute bottom-2 right-2 text-slate-400 text-xs">
            {charCount} caracteres
          </div>
        </div>

        {/* Media Preview */}
        {mediaUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {mediaUrls.map((url, idx) => (
              <div key={idx} className="relative group">
                <img src={url} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                <button
                  onClick={() => setMediaUrls((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="w-4 h-4 mr-1" />
            Emoji
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => setShowHashtagSuggestions(!showHashtagSuggestions)}
          >
            <Hash className="w-4 h-4 mr-1" />
            Hashtags
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            Mídia
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Link2 className="w-4 h-4 mr-1" />
            Link
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 ml-auto"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            IA Suggestions
          </Button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mt-3 p-3 bg-slate-700 rounded-lg flex gap-2 flex-wrap">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-2xl hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Hashtag Suggestions */}
        {showHashtagSuggestions && (
          <div className="mt-3 p-3 bg-slate-700 rounded-lg space-y-2">
            <p className="text-slate-300 text-sm font-semibold">Sugestões de Hashtags:</p>
            <div className="flex gap-2 flex-wrap">
              {hashtagSuggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addHashtag(tag)}
                  className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition text-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Platform Selection */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <p className="text-slate-300 text-sm font-semibold mb-3">Selecione as plataformas:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`px-3 py-2 rounded-lg transition text-sm font-semibold ${
                selectedPlatforms.includes(platform.id)
                  ? `${platform.color} text-white ring-2 ring-offset-2 ring-offset-slate-800`
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Schedule */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-slate-300" />
          <p className="text-slate-300 text-sm font-semibold">Agendar Publicação (Opcional)</p>
        </div>
        <input
          type="datetime-local"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-2 focus:outline-none focus:border-blue-500"
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handlePublish}
          disabled={!content.trim() || selectedPlatforms.length === 0}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 mr-2" />
          Publicar Agora
        </Button>

        <Button
          onClick={handleSchedule}
          disabled={!content.trim() || selectedPlatforms.length === 0 || !scheduledFor}
          variant="outline"
          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Clock className="w-4 h-4 mr-2" />
          Agendar
        </Button>

        <Button
          onClick={() => {
            setContent("");
            setSelectedPlatforms([]);
            setMediaUrls([]);
            setScheduledFor("");
            setCharCount(0);
          }}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
