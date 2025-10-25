import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, TrendingDown, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcoScoreDisplay } from "@/components/EcoScoreDisplay";
import { LeafChatbot } from "@/components/LeafChatbot";

// Mock data
const mockAlternative = {
  name: "Eco-Friendly Alternative Product A",
  brand: "Green Brand",
  price: "$32.99",
  description:
    "This sustainable alternative features 100% recyclable packaging, ethically sourced materials, and carbon-neutral shipping. Manufactured using renewable energy and fair trade practices.",
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
  ecoScore: {
    overall: "A",
    materials: 95,
    packaging: 90,
    manufacturing: 92,
    chemicals: 88,
    transparency: 94,
  },
  carbonFootprint: "1.4 kg CO₂e",
  carbonComparison: "equivalent to driving 3.5 miles",
  improvement: "42% lower carbon emissions than the original product",
  retailerUrl: "https://example.com",
  certifications: ["Carbon Neutral", "Fair Trade", "100% Recyclable"],
};

const AlternativeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
            <Card className="overflow-hidden shadow-soft">
              <div className="relative h-80">
                <img
                  src={mockAlternative.image}
                  alt={mockAlternative.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <Badge variant="outline" className="mb-2">
                  {mockAlternative.brand}
                </Badge>
                <h2 className="text-3xl font-bold mb-2">
                  {mockAlternative.name}
                </h2>
                <p className="text-4xl font-bold text-primary mb-4">
                  {mockAlternative.price}
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  {mockAlternative.description}
                </p>
                <Button
                  size="lg"
                  className="w-full gradient-accent text-white hover:scale-105 transition-smooth"
                  onClick={() => window.open(mockAlternative.retailerUrl, "_blank")}
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
                    {mockAlternative.certifications.map((cert) => (
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
                    {mockAlternative.carbonFootprint}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {mockAlternative.carbonComparison}
                  </p>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-700">
                      ✨ {mockAlternative.improvement}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Eco Score */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <EcoScoreDisplay {...mockAlternative.ecoScore} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlternativeDetail;
