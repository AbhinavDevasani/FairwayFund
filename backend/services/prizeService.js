export const calculatePrizePool = async (jackpotCarryForward = 0) => {
  
  const basePool = 1000;
  const total = basePool + jackpotCarryForward;

  return {
    total,
    fiveMatch: +(total * 0.40).toFixed(2),
    fourMatch: +(total * 0.35).toFixed(2),
    threeMatch: +(total * 0.25).toFixed(2),
  };
};

export const getSubscriptionPricing = (plan, charityPercent) => {
  const amount = plan === "monthly" ? 9.99 : 99.99;
  return { amount };
};
