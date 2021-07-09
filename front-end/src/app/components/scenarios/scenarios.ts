
const userPool = ['admin','user1','user2','user3','user4','user5','user6','user7','user8','user9','user10','user11','user12','user13','user14', 'user15'];
const typePool = ['deposit', 'withdraw', 'transfer'];
const superpass = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lIjoiMjAyMS0wNy0wOFQxNTowNToxNS44MDhaIiwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2MjU3NTY3MTV9.R0PYYpPW2-flxAyxNpU8melSbb_Zz_3ns2Zm7PQ0Iy8";

export const scenarios: any = [
    {
        key: 'small',
        name: 'Small scenario',
        transactions: 60,
    },
    {
        key: 'medium',
        name: 'Medium scenario',
        transactions: 1000,
        allowKills: true
    },
    {
        key: 'large',
        name: 'Large scenario',
        transactions: 5000,
        allowKills: true
    }
];

export function createTransaction(){
    const data: any = {
        from: userPool[getRandomNumber() % userPool.length],
        type: typePool[getRandomNumber() % typePool.length],
        amount: `${getRandomNumber() + 15}`,
        'x-token': superpass
    };
    if(data.type === 'transfer'){
        do{
            data.to = userPool[getRandomNumber() % userPool.length];
        }while(data.to === data.from);
    }
    return data;
}
export function getRandomNumber(){
    return Math.round(Math.random() * 1024)
}