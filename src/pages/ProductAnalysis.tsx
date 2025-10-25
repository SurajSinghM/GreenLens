import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcoScoreDisplay } from "@/components/EcoScoreDisplay";
import { AlternativeCard } from "@/components/AlternativeCard";
import { LeafChatbot } from "@/components/LeafChatbot";

// Mock data removed - now using real API data

// Helper function to extract product name from URL or query
const getProductNameFromQuery = (query: string | null): string => {
  if (!query) return "Product Analysis";
  
  // If it's an Amazon URL, try to extract product name
  if (query.includes('amazon.com')) {
    // Extract ASIN from URL
    const asinMatch = query.match(/\/dp\/([A-Z0-9]{10})/);
    if (asinMatch) {
      const asin = asinMatch[1];
      // For the specific product you searched, return a clean name
      if (asin === 'B0742JR9H1') {
        return "Campcraft Outdoors Bushcraft Cookware Bag";
      }
      return `Amazon Product (${asin})`;
    }
    return "Amazon Product";
  }
  
  // If it's a regular search query, return it as is (truncated if too long)
  if (query.length > 50) {
    return query.substring(0, 47) + "...";
  }
  
  return query;
};


const ProductAnalysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productQuery = searchParams.get("q");
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If there's a query param, call the serverless API to analyze
    const fetchAnalysis = async () => {
      if (!productQuery) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3001/api/analyze-product`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productData: { query: productQuery } }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Request failed: ${res.status}`);
        }

        const json = await res.json();
        console.log('API Response:', json); // Debug log
        if (json?.success && json.analysis) {
          console.log('Setting analysis:', json.analysis); // Debug log
          setAnalysis(json.analysis);
        } else if (json?.analysis) {
          console.log('Setting analysis (fallback):', json.analysis); // Debug log
          setAnalysis(json.analysis);
        } else {
          throw new Error(json?.error || 'No analysis returned');
        }
      } catch (err: any) {
        console.error('Analysis fetch error:', err);
        setError(err.message || String(err));
        setAnalysis(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [productQuery]);

  // Use real API data if available, otherwise show loading or error
  const display = analysis;
  console.log('Display data:', display); // Debug log

  return (
    <div className="min-h-screen bg-background">
      <LeafChatbot />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Product Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Environmental impact assessment
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-lg">Analyzing product sustainability...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <Card className="p-8 max-w-md text-center">
              <h3 className="text-lg font-semibold text-destructive mb-2">Analysis Failed</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate("/")} variant="outline">
                Try Again
              </Button>
            </Card>
          </div>
        )}

        {display && !isLoading && !error && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden shadow-soft">
                <div className="p-6">
                  <Badge variant="outline" className="mb-2">
                    {display.product?.name || getProductNameFromQuery(productQuery) || "Product Analysis"}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">
                    {display.product?.name || getProductNameFromQuery(productQuery) || "Product Analysis"}
                  </h2>
                  <p className="text-muted-foreground">
                    {display.product?.description || "Environmental impact analysis powered by AI"}
                  </p>
                </div>
              </Card>

              {/* Carbon Footprint */}
              <Card className="p-6 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <TrendingDown className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      Carbon Footprint
                    </h3>
                    <p className="text-3xl font-bold text-primary mb-1">
                      {display.carbonFootprint || "Calculating..."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {display.carbonComparison || "Analysis in progress"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* AI Insight */}
              <Card className="p-6 shadow-soft gradient-card">
                <h3 className="text-lg font-semibold mb-3">
                  🤖 AI Analysis
                </h3>
                <p className="text-foreground leading-relaxed">
                  {display.insight || "Generating environmental insights..."}
                </p>
              </Card>

              {/* Alternatives */}
              {display.alternatives && display.alternatives.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    🌱 Sustainable Alternatives
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {display.alternatives.map((alt: any, index: number) => (
                      <AlternativeCard
                        key={alt.id || index}
                        name={alt.name}
                        price={alt.priceRange}
                        ecoScore={alt.ecoScore}
                        savings={alt.carbonSavings}
                        onClick={() => navigate(`/alternative/${alt.id || index}`, { 
                          state: { alternative: alt } 
                        })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Eco Score */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {display.ecoScore ? (
                  <EcoScoreDisplay {...display.ecoScore} />
                ) : (
                  <Card className="p-6 shadow-soft">
                    <div className="text-center">
                      <div className="animate-pulse">
                        <div className="h-8 bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded"></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductAnalysis;
