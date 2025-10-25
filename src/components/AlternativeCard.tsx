import { ArrowRight, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlternativeCardProps {
  name: string;
  price: string;
  ecoScore: string;
  savings: string;
  onClick: () => void;
}

export const AlternativeCard = ({
  name,
  price,
  ecoScore,
  savings,
  onClick,
}: AlternativeCardProps) => {
  const getGradeBg = (grade: string) => {
    const colors = {
      A: "bg-green-100 text-green-700 border-green-300",
      B: "bg-green-50 text-green-600 border-green-200",
      C: "bg-yellow-50 text-yellow-600 border-yellow-200",
      D: "bg-orange-50 text-orange-600 border-orange-200",
      E: "bg-red-50 text-red-600 border-red-200",
      F: "bg-red-100 text-red-700 border-red-300",
    };
    return colors[grade as keyof typeof colors] || "bg-gray-100";
  };

  return (
    <Card className="hover:shadow-elevated transition-smooth cursor-pointer group">
      <div onClick={onClick} className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{name}</h3>
            <p className="text-2xl font-bold text-primary mb-3">{price}</p>
          </div>
          <Badge className={`${getGradeBg(ecoScore)} border font-semibold text-lg px-3 py-1`}>
            {ecoScore}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
            <Leaf className="h-3 w-3 mr-1" />
            {savings}
          </Badge>
          <Button
            size="sm"
            className="gradient-accent group-hover:scale-105 transition-smooth"
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
