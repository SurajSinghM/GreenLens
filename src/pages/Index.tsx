import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Upload, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LeafChatbot } from "@/components/LeafChatbot";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a product name or URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate(`/analysis?q=${encodeURIComponent(searchInput)}`);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file (PNG, JPEG)",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Image uploaded!",
        description: "Analyzing product from image...",
      });

      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate("/analysis?q=image-upload");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LeafChatbot />

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full gradient-accent flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  GreenLens
                </h1>
                <p className="text-xs text-muted-foreground">
                  Sustainable Shopping AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.30,
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Title */}
            <div className="space-y-4">
              <div className="inline-block">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    AI-Powered Sustainability Analysis
                  </span>
                </div>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Discover the{" "}
                <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Environmental Impact
                </span>{" "}
                of Your Purchases
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get instant eco-scores, carbon footprint estimates, and
                sustainable alternatives for any product.
              </p>
            </div>

            {/* Search Card */}
            <Card className="p-8 shadow-elevated gradient-card">
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for a product or paste an Amazon link..."
                    className="pl-12 h-14 text-lg"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    disabled={isAnalyzing}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleSearch}
                    disabled={isAnalyzing}
                    className="flex-1 h-12 text-base gradient-accent hover:scale-105 transition-smooth"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Analyze Product
                      </>
                    )}
                  </Button>

                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isAnalyzing}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-base border-2 hover:bg-primary/5 transition-smooth"
                      disabled={isAnalyzing}
                      onClick={() =>
                        document
                          .querySelector<HTMLInputElement>('input[type="file"]')
                          ?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </label>
                </div>
              </div>
            </Card>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 pt-12">
              <Card className="p-6 text-center shadow-soft hover:shadow-elevated transition-smooth">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Eco Score</h3>
                <p className="text-sm text-muted-foreground">
                  A-F rating based on sustainability factors
                </p>
              </Card>

              <Card className="p-6 text-center shadow-soft hover:shadow-elevated transition-smooth">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by advanced AI for accurate insights
                </p>
              </Card>

              <Card className="p-6 text-center shadow-soft hover:shadow-elevated transition-smooth">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Alternatives</h3>
                <p className="text-sm text-muted-foreground">
                  Find greener options for every product
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
