import { Leaf, Package, Globe, Droplet, Building } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface EcoScoreProps {
  overall: string;
  materials: number;
  packaging: number;
  manufacturing: number;
  chemicals: number;
  transparency: number;
}

const getGradeColor = (grade: string) => {
  const colors = {
    A: "text-green-600",
    B: "text-green-500",
    C: "text-yellow-500",
    D: "text-orange-500",
    E: "text-red-500",
    F: "text-red-600",
  };
  return colors[grade as keyof typeof colors] || "text-gray-500";
};

export const EcoScoreDisplay = ({
  overall,
  materials,
  packaging,
  manufacturing,
  chemicals,
  transparency,
}: EcoScoreProps) => {
  const categories = [
    {
      name: "Materials & Components",
      score: materials,
      icon: Leaf,
      color: "text-green-600",
    },
    {
      name: "Packaging Sustainability",
      score: packaging,
      icon: Package,
      color: "text-blue-600",
    },
    {
      name: "Manufacturing & Transport",
      score: manufacturing,
      icon: Globe,
      color: "text-purple-600",
    },
    {
      name: "Chemical Safety",
      score: chemicals,
      icon: Droplet,
      color: "text-cyan-600",
    },
    {
      name: "Corporate Transparency",
      score: transparency,
      icon: Building,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="p-8 text-center shadow-soft gradient-card">
        <div className="inline-block">
          <div
            className={`text-7xl font-bold ${getGradeColor(
              overall
            )} mb-2`}
          >
            {overall}
          </div>
          <p className="text-muted-foreground font-medium">Eco Score</p>
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6 shadow-soft">
        <h3 className="text-lg font-semibold mb-6">Score Breakdown</h3>
        <div className="space-y-5">
          {categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <category.icon className={`h-4 w-4 ${category.color}`} />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <span className="text-sm font-semibold">{category.score}/100</span>
              </div>
              <Progress value={category.score} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
