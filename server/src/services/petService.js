const calculateLevelUp = (currentLevel, currentExp, gainedExp) => {
    let expAfterGain = currentExp + gainedExp;
    let targetLevel = currentLevel;
    let isLevelUp = false;
    const maxLevel= 20;

    let neededExp = currentLevel * 100;

    while(expAfterGain >= neededExp && targetLevel < maxLevel){
        expAfterGain -= neededExp;
        targetLevel++;
        isLevelUp = true;
        neededExp = targetLevel * 100;
    }

    if(targetLevel >= maxLevel){
        expAfterGain = Math.min(expAfterGain, maxLevel * 100);
    }

    return {
        newLevel: targetLevel,
        newExp: expAfterGain,
        isLevelUp: isLevelUp,
        currentLevelExp: expAfterGain,
        maxLevelExp: targetLevel * 100
    };
};

module.exports = {calculateLevelUp};