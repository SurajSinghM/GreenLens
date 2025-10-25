import { ArrowRight, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlternativeCardProps {
  name: string;
  price: string;
  ecoScore: string;
  image?: string;
  savings: string;
  onClick: () => void;
}

export const AlternativeCard = ({
  name,
  price,
  ecoScore,
  image,
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
    <Card className="overflow-hidden hover:shadow-elevated transition-smooth cursor-pointer group">
      <div onClick={onClick} className="p-0">
        {image && (
          <div className="relative h-48 bg-muted overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
            <div className="absolute top-3 right-3">
              <Badge className={`${getGradeBg(ecoScore)} border font-semibold`}>
                {ecoScore}
              </Badge>
            </div>
          </div>
        )}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold line-clamp-2 flex-1">{name}</h3>
            <Badge variant="outline" className="text-green-600 border-green-300">
              <Leaf className="h-3 w-3 mr-1" />
              {savings}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-primary">{price}</p>
            <Button
              size="sm"
              className="gradient-accent group-hover:scale-105 transition-smooth"
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
