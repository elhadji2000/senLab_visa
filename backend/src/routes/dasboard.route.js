const express = require('express');
const router = express.Router();

const User = require('../models/UserModel');
const Quiz = require('../models/QuizModel');
const Simulation = require('../models/SimulationModel');
const UserActivity = require('../models/UserActivity');
const QuizResult = require('../models/quizResult');
// Routes pour le dashboard
router.get('/summary', async (req, res) => {
  try {
    // Récupération des données principales
    const [totalUsers, activeUsers, totalQuizzes, totalSimulations] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastActive: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Quiz.countDocuments(),
      Simulation.countDocuments()
    ]);

    // Statistiques de complétion des quizzes (exemple)
    const completedQuizzes = await QuizResult.countDocuments({ completed: true });
    const inProgressQuizzes = await QuizResult.countDocuments({ completed: false, startedAt: { $exists: true } });
    const notStartedQuizzes = totalQuizzes - completedQuizzes - inProgressQuizzes;

    res.json({
      totalUsers,
      activeUsers,
      totalQuizzes,
      totalSimulations,
      completedQuizzes,
      inProgressQuizzes,
      notStartedQuizzes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/progress', async (req, res) => {
  try {
    // Données hebdomadaires (exemple adapté à votre structure)
    const dailyProgress = await UserActivity.aggregate([
      {
        $match: {
          date: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" },
          users: { $sum: "$activeUsers" },
          quizzes: { $sum: "$completedQuizzes" },
          simulations: { $sum: "$completedSimulations" }
        }
      },
      {
        $project: {
          day: "$_id",
          users: 1,
          quizzes: 1,
          simulations: 1,
          _id: 0
        }
      }
    ]);

    // Mapper les jours de la semaine
    const dayMap = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const formattedData = dailyProgress.map(item => ({
      name: dayMap[item.day - 1],
      utilisateurs: item.users,
      quizzes: item.quizzes,
      simulations: item.simulations
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/growth', async (req, res) => {
  try {
    // Croissance sur 6 mois
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: "$_id",
          users: "$count",
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    // Mapper les mois
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const formattedGrowth = userGrowth.map(item => ({
      month: monthNames[item.month - 1],
      users: item.users
    }));

    res.json(formattedGrowth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;