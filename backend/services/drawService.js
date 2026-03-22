export const generateWinningNumbers = () => {
    const nums = new Set();
    while (nums.size < 5) {
      nums.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(nums).sort((a, b) => a - b);
  };
  
  export const getMatches = (userScores, winningNumbers) => {
    return userScores.filter((v) => winningNumbers.includes(v)); 
  };
  
  export const findWinners = (usersWithScores, winningNumbers) => {
    const results = [];
  
    for (const user of usersWithScores) {
      const matched = getMatches(user.scores, winningNumbers);
      if (matched.length >= 3) {
        results.push({
          userId: user._id,
          matchCount: Math.min(matched.length, 5),
          matchedNumbers: matched.slice(0, 5),
        });
      }
    }
  
    return results;
  };
  
