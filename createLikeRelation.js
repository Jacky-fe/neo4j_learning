const neo4j = require('neo4j-driver').v1;
const getRandomArray = require('./utils').getRandomArray;
const getRandomInt = require('./utils').getRandomInt;

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'zhangkai'), { encrypted: false });
let count = 0;
const max = 110000;
// 从10000 开始的都是正常用户

createRecord(20000);
console.log('begin create');
function createRecord(number) {
  const session = driver.session();
  session
    .run('MATCH (you:User {name: {name}}) UNWIND {friends}  as name  MATCH (other:User {name:name}) CREATE (you)-[:LIKE {weight:{weight}}]->(other)', 
    { 
      name: `jacky${number}`, 
      friends: getRandomArray('jacky', getRandomInt(5, 15), 10000, 19999, number),
      weight: getRandomInt(1, 10)
    })
    .subscribe({
      onNext: (record) => {
        console.log(number);
      },
      onCompleted: () => {
        console.log(number);
        number++;
        count++;
        session.close();
        if (number >= max) {
          driver.close();
        } else {
          createRecord(number);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    });
}
