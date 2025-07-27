import React, { useState } from "react";
import { X, Calculator, TrendingUp, Building2, CreditCard, Globe } from "lucide-react";
import { TaxRegime } from "@/stores/taxTraderStore";

export type ResidenceStatus = "indian" | "foreign";

interface TaxPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: {
    totalSalary: number;
    otherIncomeSources: number;
    regime: TaxRegime;
    employeeTAN?: string;
    panNumber: string;
    residenceStatus: ResidenceStatus;
  }) => void;
  isLoading?: boolean;
}

const REGIME_OPTIONS: Array<{
  value: TaxRegime;
  label: string;
  description: string;
  color: string;
  benefits: string[];
}> = [
  {
    value: "old",
    label: "Old Tax Regime",
    description: "Traditional regime with deductions and exemptions",
    color: "text-blue-400 border-blue-400/50",
    benefits: [
      "Section 80C deductions up to ₹1.5L",
      "HRA exemption",
      "Section 80D health insurance",
      "Home loan interest deduction",
      "NPS contributions",
    ],
  },
  {
    value: "new",
    label: "New Tax Regime",
    description: "Simplified regime with lower tax rates",
    color: "text-green-400 border-green-400/50",
    benefits: [
      "Lower tax rates",
      "No complex deductions",
      "Simplified tax filing",
      "Better for those with few deductions",
      "Standard deduction of ₹50,000",
    ],
  },
];

const RESIDENCE_OPTIONS: Array<{
  value: ResidenceStatus;
  label: string;
  description: string;
  color: string;
}> = [
  {
    value: "indian",
    label: "Indian Resident",
    description: "Indian citizen or resident for tax purposes",
    color: "text-orange-400 border-orange-400/50",
  },
  {
    value: "foreign",
    label: "Foreign Resident",
    description: "Non-resident or foreign citizen",
    color: "text-purple-400 border-purple-400/50",
  },
];

export default function TaxPreferencesModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: TaxPreferencesModalProps) {
  const [totalSalary, setTotalSalary] = useState<number>(0);
  const [otherIncomeSources, setOtherIncomeSources] = useState<number>(0);
  const [regime, setRegime] = useState<TaxRegime>("old");
  const [employeeTAN, setEmployeeTAN] = useState<string>("");
  const [panNumber, setPanNumber] = useState<string>("");
  const [residenceStatus, setResidenceStatus] = useState<ResidenceStatus>("indian");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Modal form submitted:", {
      totalSalary,
      otherIncomeSources,
      regime,
      employeeTAN,
    });

    if (totalSalary < 0) {
      alert("Total salary cannot be negative");
      return;
    }

    if (otherIncomeSources < 0) {
      alert("Other income sources cannot be negative");
      return;
    }

    if (totalSalary + otherIncomeSources === 0) {
      alert("Total income cannot be zero");
      return;
    }

    if (!panNumber.trim()) {
      alert("PAN Number is required");
      return;
    }

    // Basic PAN validation (10 characters: 5 letters, 4 digits, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.trim().toUpperCase())) {
      alert("Please enter a valid PAN Number (e.g., ABCDE1234F)");
      return;
    }

    const submitData = {
      totalSalary,
      otherIncomeSources,
      regime,
      employeeTAN: employeeTAN.trim() || undefined,
      panNumber: panNumber.trim().toUpperCase(),
      residenceStatus,
    };

    console.log("📤 Submitting to parent:", submitData);
    onSubmit(submitData);
  };

  console.log("🎯 TaxPreferencesModal render:", { isOpen, isLoading });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#C54F51]/20 rounded-full flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#C54F51]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Tax Analysis Preferences
              </h2>
              <p className="text-sm text-gray-400">
                Provide your income details for personalized tax planning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
            disabled={isLoading}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Income Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Salary */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Total Annual Salary (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={totalSalary || ""}
                  onChange={(e) =>
                    setTotalSalary(parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C54F51] focus:border-transparent"
                  placeholder="500000"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  ₹
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Your total annual salary including basic, allowances, and
                bonuses
              </p>
            </div>

            {/* Other Income Sources */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Other Income Sources (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={otherIncomeSources || ""}
                  onChange={(e) =>
                    setOtherIncomeSources(parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C54F51] focus:border-transparent"
                  placeholder="50000"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  ₹
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Rental income, interest, capital gains, etc.
              </p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PAN Number */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                PAN Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C54F51] focus:border-transparent"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Permanent Account Number (10 characters: ABCDE1234F format)
              </p>
            </div>

            {/* Residence Status */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Residence Status
              </label>
              <div className="space-y-2">
                {RESIDENCE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-800/50 ${
                      residenceStatus === option.value
                        ? `${option.color} bg-gray-800/30`
                        : "border-gray-600 bg-gray-800/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="residenceStatus"
                      value={option.value}
                      checked={residenceStatus === option.value}
                      onChange={(e) =>
                        setResidenceStatus(e.target.value as ResidenceStatus)
                      }
                      className="sr-only"
                    />

                    <div className="flex items-center space-x-3 flex-1">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          residenceStatus === option.value
                            ? option.color
                            : "border-gray-600"
                        }`}
                      >
                        <Globe
                          className={`w-3 h-3 ${
                            residenceStatus === option.value ? "" : "text-gray-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div
                          className={`font-medium text-sm ${
                            residenceStatus === option.value ? "" : "text-gray-300"
                          }`}
                        >
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-400">
                          {option.description}
                        </div>
                      </div>
                    </div>

                    {residenceStatus === option.value && (
                      <div
                        className={`w-2 h-2 rounded-full ${option.color
                          .replace("text-", "bg-")
                          .replace("border-", "bg-")}`}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tax Regime Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Preferred Tax Regime
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REGIME_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    regime === option.value
                      ? `${option.color} bg-gray-800/50`
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onClick={() => setRegime(option.value)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          regime === option.value
                            ? "border-current bg-current"
                            : "border-gray-400"
                        }`}
                      >
                        {regime === option.value && (
                          <div className="w-2 h-2 bg-gray-900 rounded-full m-0.5" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          regime === option.value
                            ? option.color.split(" ")[0]
                            : "text-white"
                        }`}
                      >
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {option.description}
                      </p>
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-300 mb-2">
                          Key Benefits:
                        </p>
                        <ul className="text-xs text-gray-400 space-y-1">
                          {option.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1 h-1 bg-gray-500 rounded-full mr-2" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee TAN (Optional) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Employee TAN (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={employeeTAN}
                onChange={(e) => setEmployeeTAN(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C54F51] focus:border-transparent"
                placeholder="e.g., ABCD12345E"
                maxLength={10}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Tax Deduction Account Number (TAN) for more accurate analysis
            </p>
          </div>

          {/* Tax Profile Summary */}
          {(totalSalary > 0 || otherIncomeSources > 0 || panNumber.trim()) && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
              <h4 className="text-sm font-medium text-gray-300 mb-4">
                Tax Profile Summary
              </h4>
              
              {/* Income Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-400">Total Salary</p>
                  <p className="text-white font-medium">
                    ₹{totalSalary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Other Income</p>
                  <p className="text-white font-medium">
                    ₹{otherIncomeSources.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Total Income</p>
                  <p className="text-[#C54F51] font-bold">
                    ₹{(totalSalary + otherIncomeSources).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm pt-3 border-t border-gray-700">
                <div>
                  <p className="text-gray-400">PAN Number</p>
                  <p className="text-white font-medium">
                    {panNumber.toUpperCase() || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Residence Status</p>
                  <p className="text-white font-medium">
                    {RESIDENCE_OPTIONS.find(opt => opt.value === residenceStatus)?.label || "Indian Resident"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Tax Regime</p>
                  <p className="text-white font-medium">
                    {regime === "old" ? "Old Tax Regime" : "New Tax Regime"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-[#C54F51] hover:bg-[#C54F51]/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || totalSalary + otherIncomeSources === 0}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                "Start Tax Analysis"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
