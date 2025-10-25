import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, ExternalLink, TrendingDown, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcoScoreDisplay } from "@/components/EcoScoreDisplay";
import { LeafChatbot } from "@/components/LeafChatbot";


// Default mock data as fallback
const defaultAlternative = {
  name: "Alternative Product",
  brand: "Eco Brand",
  price: "Price not available",
  description: "This is a sustainable alternative product with environmental benefits.",
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  ecoScore: {
    overall: "B",
    materials: 80,
    packaging: 85,
    manufacturing: 75,
    chemicals: 90,
    transparency: 80,
  },
  carbonFootprint: "Calculating...",
  carbonComparison: "Analysis in progress",
  improvement: "Environmental benefits being calculated",
  retailerUrl: "#",
  certifications: ["Sustainable"],
};

const AlternativeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Get alternative data from navigation state or use default
  const alternative = location.state?.alternative || defaultAlternative;

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
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Alternative Details</h1>
              <p className="text-sm text-muted-foreground">
                Sustainable product comparison
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Product Card */}
            <Card className="shadow-soft">
              <div className="p-8">
                <Badge variant="outline" className="mb-2">
                  {alternative.brand || "Eco Brand"}
                </Badge>
                <h2 className="text-3xl font-bold mb-2">
                  {alternative.name}
                </h2>
                <p className="text-4xl font-bold text-primary mb-4">
                  {alternative.priceRange || alternative.price}
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  {alternative.description || "This is a sustainable alternative product with environmental benefits."}
                </p>
                <Button
                  size="lg"
                  className="w-full gradient-accent text-white hover:scale-105 transition-smooth"
                  onClick={() => window.open(alternative.retailerUrl || "#", "_blank")}
                >
                  Buy Now
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3">
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(alternative.certifications || ["Sustainable"]).map((cert) => (
                      <Badge
                        key={cert}
                        variant="secondary"
                        className="text-sm"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Carbon Comparison */}
            <Card className="p-6 shadow-soft gradient-card">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    Environmental Impact
                  </h3>
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {alternative.carbonFootprint || "Calculating..."}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {alternative.carbonComparison || "Analysis in progress"}
                  </p>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-700">
                      ✨ {alternative.carbonSavings || alternative.improvement || "Environmental benefits"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Eco Score */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <EcoScoreDisplay {...alternative.ecoScore} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlternativeDetail;
