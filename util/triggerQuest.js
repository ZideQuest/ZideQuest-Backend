import mongoose from "mongoose";
import cron from "node-cron";

const Quest = mongoose.model('Quest', questSchema);

cron.schedule('* * * * *', async () => {
    try {
      const currentTime = new Date();
  
      const questsToComplete = await Quest.find({
        timeEnd: { $lte: currentTime },
        autoComplete: true,
        status: false,
      });
  
      for (const quest of questsToComplete) {
        console.log(`Completing quest: ${quest.questName}`);
  
        quest.status = true;
        await quest.save();
      }
    } catch (error) {
      console.error('Error completing quests:', error);
    }
  });