// components/TongueTwister/TongueTwister.tsx
import React from 'react';

const TongueTwister = () => {
    const tongueTwisters = [
        "Clan climbers cling to cliffs with clever grips.",
        "Crisp cliffs challenge clever clan climbers.",
        "Clan climbers' climbing clashes cause countless cheers.",
        "Cliff-clinging clan climbers conquer craggy crests.",
        "Clan climbers conquer crags, clambering quickly.",
        "Clever clan climbers cling to crumbling cliffs.",
        "Clan climbers clip carabiners carefully, conquering cliffs.",
        "Clan climbers' crisp climbs create countless challenges.",
        "Craggy cliffs call cunning clan climbers constantly.",
        "Clan climbers' climbing quests conquer crumbling cliffs."
    ];

    function getRandomTongueTwister() {
        const randomIndex = Math.floor(Math.random() * tongueTwisters.length);
        return tongueTwisters[randomIndex];
    }

    return <div>{getRandomTongueTwister()}</div>;
};

export default TongueTwister;
