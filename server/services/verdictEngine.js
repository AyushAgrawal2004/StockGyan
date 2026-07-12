/**
 * Deterministic Verdict Engine
 * Converts a calculated StockGyan Score into a strict, predefined verdict.
 */

export const getVerdict = (score) => {
  if (score >= 90) {
    return {
      verdict: "STRONG BUY",
      color: "text-[#064E3B]", // Dark Green
      badgeColor: "bg-[#D1FAE5] border-[#34D399]",
      description: "Excellent company with strong fundamentals, healthy financials, positive market sentiment and attractive long-term investment potential."
    };
  } 
  
  if (score >= 80) {
    return {
      verdict: "BUY",
      color: "text-[#16A34A]", // Green
      badgeColor: "bg-[#DCFCE7] border-[#86EFAC]",
      description: "Strong investment opportunity with only minor concerns."
    };
  }

  if (score >= 70) {
    return {
      verdict: "ACCUMULATE",
      color: "text-[#65A30D]", // Light Green (Lime)
      badgeColor: "bg-[#ECFCCB] border-[#BEF264]",
      description: "A fundamentally good company, but investors should accumulate gradually instead of investing all at once."
    };
  }

  if (score >= 60) {
    return {
      verdict: "HOLD",
      color: "text-[#D97706]", // Amber
      badgeColor: "bg-[#FEF3C7] border-[#FCD34D]",
      description: "Suitable for existing investors. New investors should wait for better valuation or stronger growth."
    };
  }

  if (score >= 50) {
    return {
      verdict: "WATCHLIST",
      color: "text-[#EA580C]", // Orange
      badgeColor: "bg-[#FFEDD5] border-[#FDBA74]",
      description: "The company requires monitoring. Wait for better financial performance or improved market conditions."
    };
  }

  if (score >= 35) {
    return {
      verdict: "AVOID",
      color: "text-[#DC2626]", // Red
      badgeColor: "bg-[#FEE2E2] border-[#FCA5A5]",
      description: "Weak fundamentals or elevated risks make this company unsuitable for investment at the moment."
    };
  }

  // 0 - 34
  return {
    verdict: "STRONG AVOID",
    color: "text-[#7F1D1D]", // Dark Red
    badgeColor: "bg-[#FEF2F2] border-[#FECACA]",
    description: "The company currently presents significant financial or business risks."
  };
};

/**
 * Calculates a deterministic Risk Level string based on Beta
 */
export const getRiskLevel = (quote) => {
  const beta = quote?.summaryDetail?.beta || 1;
  if (beta < 0.8) return "Low";
  if (beta <= 1.2) return "Medium";
  if (beta <= 1.5) return "High";
  return "Very High";
};
