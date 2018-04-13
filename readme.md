
以下脚本共做了这些事情
1. 一共90000用户，33个游戏，10个活动，33个地点，12个星座，2个性别，共90090个节点；
2. 平均每个用户有一个性别，一个星座，10个关注，玩过5个游戏，参加过5个活动，一个地点；
共90000 * （1+1+10+5+5+1）= 207万 个关系

这段查询是查找jacky10000，玩过共同游戏，关注共同玩家，拥有共同活动，或同星座，同性别，同地点的按权重降序推荐玩家
在交流版共耗时6秒左右。对于小公司10万活跃用户情况下是满足需求的，不用使用job去跑，用redis缓存结果即可。

match (a:User {name:"jacky10000"})-[:LIKE]->(b:User) with collect (id(b)) as likers 
with likers 
match (other:User) where other.name <> "jacky10000" and not id(other) in likers 
with other
match (a:User {name:"jacky10000"})-[myR:PLAY_GAME|LOCATED_IN|ACTIVE_OWNED|GENDER_OWNED|CONSTELLATION_OWNED]->() <-[oR:PLAY_GAME|LOCATED_IN|ACTIVE_OWNED|GENDER_OWNED|CONSTELLATION_OWNED] - (other) return other.name, sum(myR.weight) as weight , count(*) as rr order by weight desc skip 32 limit 4