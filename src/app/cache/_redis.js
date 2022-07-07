/**
 * description: 缓存
 * author: kelin
 */


/**
 * redis set
 * @param {String} key redis的键值对
 * @param {String} val redis的键值对
 * @param {Number} timeout redis数据的过期时间
 */
exports.set = (key, val, timeout = 60*60) => {
    if(typeof val === "object") val = JSON.stringify(val);
    redisClient.set(key, val);
    redisClient.expire(key, timeout);
}

/**
 * redis get
 * @param {String} key redis的键值对
 */
exports.get = (key) => {

}