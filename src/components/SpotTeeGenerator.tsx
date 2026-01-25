import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader2, Download, Sparkles, ShoppingBag, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedSection from "./AnimatedSection";
import ParticleBackground from "./ParticleBackground";

const COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Coral", hex: "#E87F5F" },
  { name: "Mauve", hex: "#C8A2B3" },
  { name: "Sunset", hex: "#E8A85F" },
  { name: "Tan", hex: "#C9B896" },
  { name: "Army", hex: "#5E6B4E" },
  { name: "Dark Heather", hex: "#4A4A4A" },
  { name: "Olive", hex: "#6B7259" },
  { name: "Ice Blue", hex: "#B8E0E8" },
  { name: "Blue Jean", hex: "#7A9BB8" },
  { name: "Grey", hex: "#9B9B9B" },
  { name: "Sky", hex: "#8CC4D8" },
  { name: "Brown Savana", hex: "#7D6B5D" },
  { name: "Espresso", hex: "#5D4E42" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "Navy", hex: "#2C3E50" },
  { name: "Pink", hex: "#E8B4C8" },
  { name: "Peachy", hex: "#E8C4B8" },
  { name: "Red", hex: "#C84040" },
];

const SIZES = ["S", "M", "L", "XL", "2XL"];

const SpotTeeGenerator = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedColor, setSelectedColor] = useState("White");
  const [selectedSize, setSelectedSize] = useState("L");
  const [customPrompt, setCustomPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setGeneratedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const generateImage = async () => {
    if (!uploadedImage) {
      toast.error("Please upload a photo first");
      return;
    }

    if (!user) {
      toast.error("Please sign in to use the AI Try-On feature");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-spot-tee-image", {
        body: {
          userImageBase64: uploadedImage,
          color: selectedColor,
          size: selectedSize,
          customPrompt: customPrompt,
        },
      });

      if (error) {
        console.error("Function error:", error);
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          toast.error("Please sign in to use this feature");
          return;
        }
        throw new Error(error.message || "Failed to generate image");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Your Spot Tee preview is ready!");
      } else {
        throw new Error("No image received");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `spot-tee-${selectedColor.toLowerCase()}-${selectedSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Show auth prompt if not logged in
  if (!authLoading && !user) {
    return (
      <section id="try-on" className="py-20 relative">
        <ParticleBackground />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                AI-Powered Try-On
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                See Yourself in a Spot Tee
              </h2>
              <p className="text-muted-foreground mb-8">
                Upload a full-body photo and our AI will show you wearing the Spot Tee in your chosen color and size
              </p>
              
              <Card className="liquid-glass-card border-border/50 max-w-md mx-auto">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <LogIn className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Sign in to try on</h3>
                    <p className="text-muted-foreground text-sm">
                      Create a free account to use the AI Try-On feature
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/auth">
                      <LiquidGlassButton size="lg">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </LiquidGlassButton>
                    </Link>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/auth">Create Account</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <section id="try-on" className="py-20 relative">
      <ParticleBackground />
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Try-On
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              See Yourself in a Spot Tee
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload a full-body photo and our AI will show you wearing the Spot Tee in your chosen color and size
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Controls */}
          <AnimatedSection delay={0.1}>
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Upload Your Photo</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      uploadedImage
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    {uploadedImage ? (
                      <div className="space-y-3">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="max-h-48 mx-auto rounded-lg object-contain"
                        />
                        <p className="text-sm text-muted-foreground">Click to change photo</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">Click to upload</p>
                          <p className="text-sm text-muted-foreground">Full-body photo works best</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Choose Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                            : "border-border hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Selected: {selectedColor}</p>
                </div>

                {/* Size Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Size</Label>
                  <div className="flex gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border font-medium transition-all ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:border-primary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Prompt */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Custom Instructions (Optional)</Label>
                  <Textarea
                    placeholder="E.g., 'Make it look like I'm at the beach' or 'Add some studio lighting'"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">{customPrompt.length}/500 characters</p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateImage}
                  disabled={!uploadedImage || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Your Preview...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Spot Tee Preview
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Right: Preview */}
          <AnimatedSection delay={0.2}>
            <Card className="border-border/50 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <Label className="text-base font-semibold mb-3">Your Preview</Label>
                <div className="flex-1 rounded-xl bg-muted/50 flex items-center justify-center min-h-[400px] overflow-hidden">
                  {isGenerating ? (
                    <div className="text-center space-y-4">
                      <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                      <div>
                        <p className="font-medium text-foreground">Creating your look...</p>
                        <p className="text-sm text-muted-foreground">This may take a few seconds</p>
                      </div>
                    </div>
                  ) : generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated Spot Tee preview"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center space-y-3 px-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Upload a photo and click generate to see yourself in a Spot Tee
                      </p>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <div className="mt-4 flex gap-3">
                    <Button onClick={downloadImage} variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      asChild
                      className="flex-1"
                    >
                      <a
                        href="https://blacklabspotsshop.printify.me/product/25456436/spot-tee"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Buy This Tee
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default SpotTeeGenerator;
