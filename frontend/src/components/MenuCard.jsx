import { Flame, Scale, Plus, CheckCircle2, XCircle } from "lucide-react";
import { kcal, weightOf } from "../utils/nutrition";

export default function MenuCard(props) {
  // Support both item object or direct props
  const item = props.item || props;
  const {
    id,
    name = props.title,
    price = props.cost,
    category,
    available,
    caloriesPer100g,
    weightG,
    description,
    image,
    onAddToOrder,
  } = item;

  // Exact formulas from exam specification
  const portionWeight = weightOf({ weightG });
  const energyKcal = kcal({ caloriesPer100g, weightG });

  const categoryBadgeColors = {
    snack: "bg-amber-100 text-amber-800 border-amber-200",
    meal: "bg-emerald-100 text-emerald-800 border-emerald-200",
    drink: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const handleAdd = () => {
    if (!available) return;
    if (onAddToOrder) {
      onAddToOrder({
        id,
        name,
        price,
        category,
        available,
        caloriesPer100g,
        weightG,
        description,
        image,
      });
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white rounded-card overflow-hidden border transition-all duration-300 ${
        available
          ? "border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1"
          : "border-gray-200 bg-gray-50/70 opacity-80"
      }`}
    >
      {/* Top Banner / Image (if available) */}
      <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              available ? "group-hover:scale-105" : "grayscale"
            }`}
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 text-orange-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border backdrop-blur-md shadow-sm ${
            categoryBadgeColors[category?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200"
          }`}
        >
          {category}
        </span>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {available ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Available</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/90 text-white backdrop-blur-md shadow-sm">
              <XCircle className="w-3.5 h-3.5" />
              <span>Not Available</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-lg font-bold text-charcoal tracking-tight group-hover:text-primary-600 transition-colors">
              {name}
            </h3>
            {/* Price formatted as ₹ with two decimals */}
            <span className="text-lg font-extrabold text-primary-600 tracking-tight whitespace-nowrap">
              ₹{Number(price).toFixed(2)}
            </span>
          </div>

          {description && (
            <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
              {description}
            </p>
          )}

          {/* Nutrition Meta Info: Portion Weight & Energy in kcal */}
          <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
              <Scale className="w-3.5 h-3.5 text-gray-400" />
              <span>Portion:</span>
              <strong className="text-charcoal font-semibold">{portionWeight} g</strong>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 font-medium">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Energy:</span>
              <strong className="text-charcoal font-semibold">{energyKcal} kcal</strong>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 mt-auto">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!available}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
              available
                ? "bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white shadow-md shadow-orange-500/20"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add to Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
