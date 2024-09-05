const User = require('C:/Users/wkeyq/OneDrive/Рабочий стол/Yoku/models/User'); 

const eco = {
  // Create or find a user in the database
  getUser: async (userId) => {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId });
      await user.save();
    }
    return user;
  },

  // Get user's balance
  getBalance: async (userId) => {
    const user = await eco.getUser(userId);
    return user.balance;
  },

  // Add money to a user's balance
  addMoney: async (userId, amount) => {
    const user = await eco.getUser(userId);
    user.balance += amount;
    await user.save();
    return true; 
  },

  // Remove money from a user's balance
  removeMoney: async (userId, amount) => {
    const user = await eco.getUser(userId);
    if (user.balance < amount) {
      return false; // Not enough money
    }
    user.balance -= amount;
    await user.save();
    return true;
  },

  // Example: Transfer money between users
  transferMoney: async (senderId, receiverId, amount) => {
    if (await eco.removeMoney(senderId, amount)) {
      await eco.addMoney(receiverId, amount);
      return true; 
    } else {
      return false; 
    }
  },

  // ... (Add more economy functions: item management, daily rewards, leaderboards, etc.)
};

module.exports = eco;