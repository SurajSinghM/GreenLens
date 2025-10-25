import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EcoScoreDisplay } from "@/components/EcoScoreDisplay";
import { AlternativeCard } from "@/components/AlternativeCard";
import { LeafChatbot } from "@/components/LeafChatbot";

// Mock data for demonstration
const mockAnalysis = {
  product: {
    name: "Example Product",
    brand: "Brand Name",
    price: "$29.99",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    description: "A typical product description would appear here",
  },
  ecoScore: {
    overall: "C",
    materials: 65,
    packaging: 55,
    manufacturing: 70,
    chemicals: 60,
    transparency: 50,
  },
  carbonFootprint: "2.4 kg CO₂e",
  carbonComparison: "equivalent to driving 6 miles",
  insight:
    "This product uses non-recyclable plastic packaging and lacks environmental certification. Manufacturing processes have moderate carbon emissions.",
  alternatives: [
    {
      id: "1",
      name: "Eco-Friendly Alternative Product A",
      price: "$32.99",
      ecoScore: "A",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      savings: "42% less CO₂",
    },
    {
      id: "2",
      name: "Sustainable Choice B",
      price: "$35.99",
      ecoScore: "B",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      savings: "35% less CO₂",
    },
    {
      id: "3",
      name: "Green Option C",
      price: "$28.99",
      ecoScore: "B",
      image: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
      savings: "30% less CO₂",
    },
  ],
};

const ProductAnalysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productQuery = searchParams.get("q");

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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden shadow-soft">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={mockAnalysis.product.image}
                    alt={mockAnalysis.product.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <Badge variant="outline" className="mb-2">
                    {mockAnalysis.product.brand}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">
                    {mockAnalysis.product.name}
                  </h2>
                  <p className="text-3xl font-bold text-primary mb-3">
                    {mockAnalysis.product.price}
                  </p>
                  <p className="text-muted-foreground">
                    {mockAnalysis.product.description}
                  </p>
                </div>
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
                    {mockAnalysis.carbonFootprint}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockAnalysis.carbonComparison}
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
                {mockAnalysis.insight}
              </p>
            </Card>

            {/* Alternatives */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                🌱 Sustainable Alternatives
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {mockAnalysis.alternatives.map((alt) => (
                  <AlternativeCard
                    key={alt.id}
                    {...alt}
                    onClick={() => navigate(`/alternative/${alt.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Eco Score */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <EcoScoreDisplay {...mockAnalysis.ecoScore} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductAnalysis;
