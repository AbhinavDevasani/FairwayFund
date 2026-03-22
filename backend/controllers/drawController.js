import Draw from "../models/Draw.js";
import User from "../models/User.js";
import Score from "../models/Score.js";
import Winner from "../models/Winner.js";
import { generateWinningNumbers, findWinners } from "../services/drawService.js";
import { calculatePrizePool } from "../services/prizeService.js";

const getUsersWithScores = async () => {
  const users = await User.find({ isSubscribed: true });
  
  
  const scoresByUserId = {};
  const scores = await Score.find().sort({ createdAt: -1 });
  scores.forEach(s => {
    const sId = s.userId.toString();
    if (!scoresByUserId[sId]) scoresByUserId[sId] = [];
    scoresByUserId[sId].push(s.score);
  });

  return users.map(u => ({
    _id: u._id,
    scores: scoresByUserId[u._id.toString()] || [],
  })).filter(u => u.scores.length > 0);
};

export const simulateDraw = async (req, res) => {
  try {
    const winningNumbers = generateWinningNumbers();
    const usersWithScores = await getUsersWithScores();
    const winners = findWinners(usersWithScores, winningNumbers);

    res.json({
      success: true,
      data: {
        winningNumbers,
        totalEligible: usersWithScores.length,
        fiveMatchWinners: winners.filter((w) => w.matchCount === 5).length,
        fourMatchWinners: winners.filter((w) => w.matchCount === 4).length,
        threeMatchWinners: winners.filter((w) => w.matchCount === 3).length,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const runDraw = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const drawThisMonth = await Draw.findOne({ createdAt: { $gte: startOfMonth } });
    if (drawThisMonth) {
      return res.status(400).json({ success: false, message: "A draw has already been run this month" });
    }

    const lastDraw = await Draw.findOne({ isPublished: true }).sort({ createdAt: -1 });
    const jackpotCarryForward = lastDraw ? lastDraw.jackpotCarryForward : 0;

    const winningNumbers = generateWinningNumbers();
    const prizePool = await calculatePrizePool(jackpotCarryForward);

    const usersWithScores = await getUsersWithScores();
    const winners = findWinners(usersWithScores, winningNumbers);

    const fiveMatch = winners.filter((w) => w.matchCount === 5);
    const fourMatch = winners.filter((w) => w.matchCount === 4);
    const threeMatch = winners.filter((w) => w.matchCount === 3);

    const draw = await Draw.create({
      winningNumbers,
      prizePool,
      jackpotCarryForward: 0,
      isPublished: true,
      status: "published",
      fiveMatchCount: fiveMatch.length,
      fourMatchCount: fourMatch.length,
      threeMatchCount: threeMatch.length,
    });

    const createWinnerRecords = async (group, poolAmount) => {
      if (group.length === 0) return;
      const perPerson = +(poolAmount / group.length).toFixed(2);
      for (const w of group) {
        await Winner.create({
          user: w.userId,
          draw: draw._id,
          matchCount: w.matchCount,
          matchedNumbers: w.matchedNumbers,
          prizeAmount: perPerson,
        });
      }
    };

    await createWinnerRecords(fiveMatch, draw.prizePool.fiveMatch);
    await createWinnerRecords(fourMatch, draw.prizePool.fourMatch);
    await createWinnerRecords(threeMatch, draw.prizePool.threeMatch);

    if (fiveMatch.length === 0) {
      draw.jackpotCarryForward = prizePool.fiveMatch;
      await draw.save();
    }

    res.status(201).json({ 
      success: true, 
      data: {
        draw, 
        results: { fiveMatch: fiveMatch.length, fourMatch: fourMatch.length, threeMatch: threeMatch.length } 
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDraw = async (req, res) => {
  try {
    const latestDraw = await Draw.findOne({ isPublished: true }).sort({ createdAt: -1 });
    if (!latestDraw) {
      return res.status(404).json({ success: false, message: "No draw available" });
    }
    res.json({ success: true, data: latestDraw });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};