/**
 * @params {boolean} isCompletedFullTime
 * @returns {object|null}
 */

const calculateRandomReward = (isCompletedFullTime) => {
    if(!isCompletedFullTime){
        return null;
    }

    const randomType = Math.random() < 0.7 ? 'COINS' : 'FOOD';

    const chance = Math.random();

    if(randomType === 'FOOD'){
        if(chance > 0.8) return {type: 'FOOD', amount: 125};
        if(chance > 0.4) return {type: 'FOOD', amount: 100};
        return {type: 'FOOD', amount: 50};
    } else{
        if(chance > 0.8) return {type: 'COINS', amount: 125};
        if(chance > 0.4) return {type: 'COINS', amount: 100}
        return {type: 'COINS', amount: 50};
    } 
};

module.exports = {calculateRandomReward};