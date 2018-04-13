const neo4j = require('neo4j-driver').v1;

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'zhangkai'), { encrypted: false });
let count = 0;
const max = 110000;
// 从10000 开始的都是正常用户
createRecord(22766);
function createRecord(number) {
  const session = driver.session();
  session
    .run('CREATE (alice:User {name : {nameParam} }) RETURN alice.name AS name', { nameParam: `jacky${number}` })
    .subscribe({
      onNext: (record) => {
        console.log(record.get('name'));
      },
      onCompleted: () => {
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
