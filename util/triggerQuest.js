import cron from "node-cron";
import Quest from '../model/quest.js'

export const intervalFetch = async () => {
    cron.schedule('* * * * *', async () => {
        try {
            const currentTime = new Date();

            const questsToComplete = await Quest.find({
                timeEnd: { $lte: currentTime },
                autoComplete: true,
                status: false,
            });

            for (const quest of questsToComplete) {
                quest.status = true;
                await quest.save();
            }
        } catch (error) {
            console.error('Error completing quests:', error);
        }
    });
}
