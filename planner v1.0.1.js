/**
 *  作者：Scorpior
 *  版本: v1.0.1
 *  changelog:
 *  1.0.1: 修了parseLayout()的bug，未改plan()，换了2号layout
 * 
 *  使用：
 *  RP('W1N1');
 *  通过在sim里摆建筑然后parse('sim')获得layout和component
 * 
 *  算法流程：
 *  1.  动态规划（dp）算4个点（source、mineral、controller）的路程图
 *  2.  dp按terrain算房间内空地，选能摆下核心区的路程和最小点作为anchor
 *  3.  根据anchor和核心layout设置CostMatrix和被占用的空地，dp摆extension，
 *      每个extension都有一个entry点作为填extension的位置，entry点按树状连接
 *      以后要用于划分extension块（TODO）
 *  4.  算到所有entry、到4个点、房间每个出口的路，铺路同时移除堵死路的extension
 *  5.  从storage沿路dp，摆被上一步移除的extension和ob（我核心不包括ob）
 *  6.  未包括rap计算
 * 
 *  
 * 
 *  TODO
 *  1.分割roadPos，2~3个作为一个cluster
 * 
 */

const config = {
    layoutSize: 7,  // 能装下整个核心区layout的单一正方形最小边长
    controllerWeight: 1,
    sourceWeight: 2,
    mineralWeight: 3,
    maxExtensionDistance: 10, // 允许摆extension的最远距离
    acceptThreshold: 2, // 控制extension分布，在最终plan()函数中可以另外指定
    reviewThreshold: 3, // 控制extension分布，在最终plan()函数中可以另外指定
    fillUpThreshold: 3
};
const MAX_EXTENSIONS = 60, EXTENSION_COST = 8;

// 布局相对位置，基准点是正方形右下角（边长为偶数时正方形中心不可用作基准点）
const layout0 = {
    storage: [{ "x": -2, "y": -2 }],
    terminal: [{ "x": -2, "y": 0 }],
    powerSpawn: [{ "x": 0, "y": 0 }],
    factory: [{ "x": 0, "y": -1 }],
    link: [{ "x": -2, "y": -4 }],
    nuker: [{ "x": 0, "y": -3 }],
    spawn: [{ "x": -1, "y": -5 }, { "x": -2, "y": -6 }, { "x": -3, "y": -5 }],
    road: [{ "x": -3, "y": -6 }, { "x": -2, "y": -5 }, { "x": -1, "y": -4 }, { "x": -1, "y": -6 }, { "x": -3, "y": -4 }, { "x": -2, "y": -3 }, { "x": -1, "y": -3 }, { "x": -1, "y": -2 }, { "x": 0, "y": -2 }, { "x": -1, "y": -1 }, { "x": -1, "y": 0 }, { "x": -2, "y": -1 }, { "x": -3, "y": -1 }, { "x": -4, "y": -2 }, { "x": -5, "y": -3 }, { "x": -5, "y": -1 }, { "x": -4, "y": 0 }, { "x": -6, "y": -2 }],
    lab: [{ "x": -5, "y": -2 }, { "x": -4, "y": -1 }, { "x": -3, "y": -2 }, { "x": -4, "y": -3 }, { "x": -3, "y": -3 }, { "x": -6, "y": -3 }, { "x": -3, "y": 0 }, { "x": -5, "y": 0 }, { "x": -6, "y": 0 }, { "x": -6, "y": -1 }],
};
const layout1 = {
    storage: [{ "x": -2, "y": -4 }],
    terminal: [{ "x": -2, "y": -6 }],
    factory: [{ "x": 0, "y": -5 }],
    link: [{ "x": -1, "y": -3 }],
    spawn: [{ "x": 0, "y": -2 }, { "x": -1, "y": -1 }, { "x": -2, "y": -2 }],
    nuker: [{ "x": 0, "y": -3 }],
    powerSpawn: [{ "x": 0, "y": -6 }],
    lab: [{ "x": -4, "y": -5 }, { "x": -5, "y": -4 }, { "x": -3, "y": -6 }, { "x": -3, "y": -4 }, { "x": -3, "y": -3 }, { "x": -4, "y": -3 }, { "x": -6, "y": -3 }, { "x": -6, "y": -5 }, { "x": -6, "y": -6 }, { "x": -5, "y": -6 }],
    road: [{ "x": -5, "y": -3 }, { "x": -4, "y": -4 }, { "x": -5, "y": -5 }, { "x": -6, "y": -4 }, { "x": -4, "y": -6 }, { "x": -3, "y": -5 }, { "x": -2, "y": -5 }, { "x": -1, "y": -5 }, { "x": -1, "y": -6 }, { "x": -1, "y": -4 }, { "x": 0, "y": -4 }, { "x": -2, "y": -3 }, { "x": -1, "y": -2 }, { "x": 0, "y": -1 }, { "x": -2, "y": -1 }],
};
const layout2 = {
    link: [{ "x": -5, "y": -4 }],
    spawn: [{ "x": -6, "y": -5 }, { "x": -4, "y": -5 }, { "x": -5, "y": -6 }],
    nuker: [{ "x": -6, "y": -4 }],
    terminal: [{ "x": -4, "y": -1 }],
    storage: [{ "x": -4, "y": -3 }],
    powerSpawn: [{ "x": -6, "y": -1 }],
    factory: [{ "x": -6, "y": -2 }],
    lab: [{ "x": -2, "y": -2 }, { "x": -2, "y": -1 }, { "x": -3, "y": 0 }, { "x": -3, "y": -2 }, { "x": -2, "y": -3 }, { "x": -4, "y": 0 }, { "x": -1, "y": -2 }, { "x": -1, "y": 0 }, { "x": 0, "y": -1 }, { "x": 0, "y": -2 }],
    road: [{ "x": -6, "y": -6 }, { "x": -5, "y": -5 }, { "x": -4, "y": -6 }, { "x": -4, "y": -4 }, { "x": -3, "y": -3 }, { "x": -4, "y": -2 }, { "x": -5, "y": -3 }, { "x": -6, "y": -3 }, { "x": -5, "y": -1 }, { "x": -5, "y": -2 }, { "x": -3, "y": -1 }, { "x": -2, "y": 0 }, { "x": -1, "y": -1 }, { "x": 0, "y": 0 }],
};
const layout3 = {
    powerSpawn: [{ "x": -5, "y": -3 }],
    factory: [{ "x": -5, "y": -5 }],
    link: [{ "x": -4, "y": -2 }],
    spawn: [{ "x": -3, "y": -1 }, { "x": -4, "y": 0 }, { "x": -5, "y": -1 }],
    storage: [{ "x": -3, "y": -4 }],
    terminal: [{ "x": -5, "y": -4 }],
    lab: [{ "x": -2, "y": -4 }, { "x": -1, "y": -4 }, { "x": -2, "y": -6 }, { "x": -1, "y": -6 }, { "x": 0, "y": -5 }, { "x": 0, "y": -4 }, { "x": 0, "y": -3 }, { "x": -2, "y": -2 }, { "x": -1, "y": -2 }],
    road: [{ "x": -1, "y": -5 }, { "x": -2, "y": -5 }, { "x": -1, "y": -3 }, { "x": -2, "y": -3 }, { "x": 0, "y": -2 }, { "x": 0, "y": -6 }, { "x": -3, "y": -2 }, { "x": -4, "y": -1 }, { "x": -4, "y": -3 }, { "x": -4, "y": -4 }, { "x": -3, "y": -5 }, { "x": -4, "y": -5 }, { "x": -5, "y": -2 }, { "x": -5, "y": 0 }, { "x": -3, "y": 0 }],
    nuker: [{ "x": -3, "y": -3 }],
};
const component0 = [{ x: 0, y: 0, offset: 3 }, { x: -3, y: 0, offset: 3 }, { x: -1, y: -4, offset: 2 }];
const component1 = [{ x: 0, y: -1, offset: 2 }, { x: 0, y: -3, offset: 3 }, { x: -3, y: -3, offset: 3 }];
const component2 = [{ "x": -4, "y": -4, "offset": 2 }, { "x": -4, "y": -3, "offset": 2 }, { "x": -5, "y": -1, "offset": 1 }, { "x": -4, "y": -5, "offset": 1 }, { "x": -2, "y": 0, "offset": 2 }, { "x": -3, "y": 0, "offset": 1 }, { "x": -2, "y": -2, "offset": 1 }, { "x": 0, "y": -1, "offset": 1 }, { "x": -1, "y": 0, "offset": 0 }, { "x": 0, "y": 0, "offset": 0 }];
const component3 = [{ x: -3, y: 0, offset: 2 }, { x: 0, y: -2, offset: 3 }, { x: -2, y: -2, offset: 3 }, { x: 0, y: -4, offset: 2 }];
const layouts = [layout0, layout1, layout2, layout3], components = [component0, component1, component2, component3];

global.colours = {
    纯红: '#FF0000',
    深红: '#DC143C',
    粉红: '#FF69B4',
    浅粉: '#FFC0CB',

    橙色: '#FFA500',
    橘红: '#FF4500',

    金菊黄: '#DAA520',
    金色: '#FFD700',
    纯黄: '#FFFF00',
    浅黄: '#FFFFE0',

    纯绿: '#008000',
    暗绿: '#006400',
    亮绿: '#00FF00',
    黄绿: '#ADFF2F',

    青色: '#00FFFF',
    暗青: '#008B8B',

    纯蓝: '#0000FF',
    亮蓝: '#87CEFA',
    天蓝: '#87CEEB',
    宝蓝: '#4169E1',
    深蓝: '#00008B',

    蓝紫: '#8A2BE2',
    纯紫: '#800080',
    亮紫: '#FF00FF',

    茶色: '#D2B48C',
    蜜白: '#F0FFF0'
};

function getEmptyMat(start, end) {
    let mat = {};
    for (let x = start; x <= end; x++) {
        mat[x] = {};
    }
    return mat;
}

let circleStyle = [
    { radius: 0.4, opacity: 0.6, fill: global.colours.暗绿 },
    { radius: 0.8, opacity: 0.6, fill: global.colours.亮绿 },
    { radius: 0.4, opacity: 0.9, fill: global.colours.金色 },
    { radius: 0.3, opacity: 0.75, fill: global.colours.茶色 },
    { radius: 0.24, opacity: 0.9, fill: global.colours.纯红 }
]
/**
 * 
 * @param {RoomVisual} rv  
 */
function showAnchor(rv, x, y, radius, style) {
    rv.circle(x - radius, y - radius, circleStyle[style]);
}

function isNear(x1, y1, x2, y2) {
    return -1 <= x1 - x2 && x1 - x2 <= 1 && -1 <= y1 - y2 && y1 - y2 <= 1;
}

/**
 * 
 * @param {RoomPosition} pos 
 * @param {number} range 
 */
function initialCost(pos, range, terrain, layoutCost) {
    let costMat = getEmptyMat(0, 49);
    let edgeSet = [];
    let j50;
    for (let j = pos.y - range; j <= pos.y + range; j++) {
        if (j < 1 || j > 48) {
            continue;
        }
        j50 = j * 50;
        for (let i = pos.x - range; i <= pos.x + range; i++) {
            if (i < 1 || i > 48 || terrain[j50 + i] & TERRAIN_MASK_WALL || (layoutCost && layoutCost[i][j] == 255)) {
                continue;
            }
            edgeSet.push({
                x: i,
                y: j
            });
            costMat[i][j] = 0;
        }
    }
    return { costMat: costMat, edgeSet: edgeSet };
}

function calCostMat(pos, range, terrain, weight) {
    let { costMat, edgeSet } = initialCost(pos, range, terrain);
    let j50, px, py;
    for (let pos of edgeSet) {
        px = pos.x;
        py = pos.y;
        for (let j = py - 1; j <= py + 1; j++) {
            if (j < 1 || j > 48) {
                continue;
            }
            j50 = j * 50;
            for (let i = px - 1; i <= px + 1; i++) {
                if (j in costMat[i] || i < 1 || i > 48 || terrain[j50 + i] & TERRAIN_MASK_WALL) {
                    continue;
                }
                edgeSet.push({
                    x: i,
                    y: j
                });
                costMat[i][j] = costMat[px][py] + weight;
            }
        }
    }
    return costMat;
}

function getCostMats(room, terrain) {
    let costMats = [calCostMat(room.controller.pos, 2, terrain, config.controllerWeight)];
    for (let source of room.source) {
        costMats.push(calCostMat(source.pos, 1, terrain, config.sourceWeight));
    }
    if (room.mineral) {
        costMats.push(calCostMat(room.mineral.pos, 1, terrain, config.mineralWeight));
    }
    return costMats;
}

function setAsWall(pos, range, terrain) {
    let j50;
    for (let j = pos.y - range; j <= pos.y + range; j++) {
        if (j <= 0 || j >= 49) {
            continue;
        }
        j50 = j * 50;
        for (let i = pos.x - range; i <= pos.x + range; i++) {
            if (i <= 0 || i >= 49) {
                continue;
            }
            terrain[j50 + i] = TERRAIN_MASK_WALL;
        }
    }
}

/**
 * 
 * @param {Room} room 
 * @param {*} terrain 
 */
function initialMap(room, terrain) {
    let map = {};
    setAsWall(room.controller.pos, 2, terrain);
    if (room.mineral) {
        setAsWall(room.mineral.pos, 1, terrain);
    }
    for (let src of room.source) {
        setAsWall(src.pos, 1, terrain);
    }
    for (let exit of room.find(FIND_EXIT)) {
        setAsWall(exit, 1, terrain);
    }
    for (let x = 1; x < 50; x++) {
        map[x] = {};
        map[x][1] = terrain[50 + x] & TERRAIN_MASK_WALL ? 0 : 1;   // 是墙则0
    }
    for (let y = 1; y < 49; y++) {
        map[1][y] = terrain[y * 50 + 1] & TERRAIN_MASK_WALL ? 0 : 1;    // 是墙则0
    }
    return map;
}

/**
 *  计算地图正方形面积同时把总路程最短的作为中心，路程相同选离controller最远的（5级先建link到controller）
 * @param {Room} room 
 * @param {*} terrain 
 * @param {number} diameter 
 * @param {RoomVisual} rv 
 */
function calSquare(room, terrain, diameter, rv, costMats) {
    let map = initialMap(room, terrain);
    let bestAnchor = { cost: 999, noControllerCost: 999 };
    let radius = Math.floor((diameter - 1) / 2);
    let y50, current, cost, noControllerCost;
    for (let y = 2; y < 49; y++) {
        y50 = y * 50;
        for (let x = 2; x < 49; x++) {
            if (terrain[y50 + x] & TERRAIN_MASK_WALL) {
                map[x][y] = 0;
            } else {
                current = map[x - 1][y - 1];
                if (current > map[x - 1][y]) {  // 取min
                    current = map[x - 1][y];
                }
                if (current > map[x][y - 1]) {  // 取min
                    current = map[x][y - 1];
                }
                current = current + 1;  // 递推
                map[x][y] = current;
                if (current >= diameter) {
                    //showAnchor(rv, x, y, (diameter - 1) / 2, 0);
                    cost = 0;
                    for (let costMat of costMats) {
                        cost += costMat[x - radius][y - radius];
                    }
                    noControllerCost = cost - costMats[0][x - radius][y - radius];
                    if (cost <= bestAnchor.cost) {
                        //rv.text(noControllerCost, x, y);
                        if (cost < bestAnchor.cost || noControllerCost < bestAnchor.noControllerCost) {
                            bestAnchor = { x: x, y: y, cost: cost, noControllerCost: noControllerCost };
                        }
                    }
                }
            }
            //rv.text(map[x][y], x, y, { opacity: 0.3 });
        }
    }
    return { map, bestAnchor };
}

/**
 *  布局内空地置0，右、下1格置最大为1，右、下2格置最大为2
 */
function getTempMap(squares, anchor, map) {
    let tempMap = getEmptyMat(1, 49), absx, absy;
    for (let square of squares) {
        absx = square.x + anchor.x;
        absy = square.y + anchor.y;
        for (let y = -square.offset; y <= 0; y++) {
            for (let x = -square.offset; x <= 0; x++) {
                if (!(y + absy in tempMap[x + absx])) {
                    tempMap[x + absx][y + absy] = map[x + absx][y + absy];
                }
                map[x + absx][y + absy] = 0;
            }
        }
        for (let i = -square.offset; i <= 1; i++) {
            if (!(absy + i in tempMap[absx + 1])) {
                tempMap[absx + 1][absy + i] = map[absx + 1][absy + i];
            }
            map[absx + 1][absy + i] = map[absx + 1][absy + i] && 1; // 0&&1 = 0, 2&&1 = 1
            if (!(absy + i in tempMap[absx + 2])) {
                tempMap[absx + 2][absy + i] = map[absx + 2][absy + i];
            }
            map[absx + 2][absy + i] = map[absx + 2][absy + i] >= 2 ? 2 : map[absx + 2][absy + i];
            if (!(absy + 1 in tempMap[absx + i])) {
                tempMap[absx + i][absy + 1] = map[absx + i][absy + 1];
            }
            map[absx + i][absy + 1] = map[absx + i][absy + 1] && 1;
            if (!(absy + 2 in tempMap[absx + i])) {
                tempMap[absx + i][absy + 2] = map[absx + i][absy + 2];
            }
            map[absx + i][absy + 2] = map[absx + i][absy + 2] >= 2 ? 2 : map[absx + i][absy + 2];
        }
        if (!(absy + 2 in tempMap[absx + 2])) {
            tempMap[absx + 2][absy + 2] = map[absx + 2][absy + 2];
        }
        map[absx + 2][absy + 2] = map[absx + 2][absy + 2] >= 2 ? 2 : map[absx + 2][absy + 2];
    }
    return tempMap;
}

function recoverMap(tempMap, map) {
    for (let x in tempMap) {
        for (let y in tempMap[x]) {
            map[x][y] = tempMap[x][y];
        }
    }
}

function getLayoutCost(anchor, layout) {
    let layoutCost = getEmptyMat(0, 49);
    let cost;
    for (let type in layout) {
        cost = type == STRUCTURE_ROAD ? 1 : 255;
        for (let pos of layout[type]) {
            layoutCost[anchor.x + pos.x][anchor.y + pos.y] = cost;
        }
    }
    return layoutCost;
}

/**
 * 
 * @param {number} x 测试中心x
 * @param {number} y 测试中心y
 * @param {{[x:number]:{[y:number]:number}}} costMat 每个点到storage的距离
 * @param {*} planedExtensions 已放置的extension
 * @param {*} planedEntries 已放置的entry
 */
function testSquare(x, y, costMat, planedExtensions, planedEntries, blockX, blockY, blockCost) {
    let num = 0, nearest = { cost: config.maxExtensionDistance + 1, x: 0, y: 0 }, hasEntry = false;
    let extPos = [];
    let edgeEntry, centralEntry, ext;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i == x && j == y) {                 // 中心点
                if (j in planedExtensions[i]) {     // 如果有extension则要移除 
                    num--;
                    if (!hasEntry) {
                        hasEntry = true;
                        centralEntry = { x: i, y: j };  // 自身点
                        ext = planedExtensions[i][j];
                        edgeEntry = planedEntries[ext.eX][ext.eY];
                    }
                }
            } else if (i != blockX || j != blockY) {// 边缘点且不是square32中被挡那块
                if (!hasEntry) {                    // 还没找到entry
                    if (j in planedEntries[i]) {    // 这个点是别人的entry 
                        hasEntry = true;
                        centralEntry = { x, y };
                        edgeEntry = planedEntries[i][j];
                        continue;
                    } else if (costMat[i][j] < nearest.cost) {  // 找离storage最近的点准备作为entry
                        nearest.cost = costMat[i][j];
                        nearest.x = i;
                        nearest.y = j;
                    }
                }
                if (!(j in planedExtensions[i]) && !(j in planedEntries[i])) { // 这个点没人用过
                    extPos.push({ x: i, y: j, eX: x, eY: y });  // 自身点，entry点
                    num++;
                }
            } else if (blockCost == 1) {            // 
                hasEntry = true;
                centralEntry = { x, y };
                edgeEntry = { x: i, y: j, isHead: true };
            }
        }
    }
    if (!hasEntry) {
        centralEntry = { x, y };
        if (nearest.y in planedExtensions[nearest.x]) {
            ext = planedExtensions[nearest.x][nearest.y];
            let cEntry = planedEntries[ext.eX][ext.eY];
            if (isNear(cEntry.parentEntryX, cEntry.parentEntryY, nearest.x, nearest.y)) {
                edgeEntry = { x: nearest.x, y: nearest.y, parentEntryX: cEntry.parentEntryX, parentEntryY: cEntry.parentEntryY };
            } else {
                edgeEntry = { x: nearest.x, y: nearest.y, parentEntryX: ext.eX, parentEntryY: ext.eY };
            }
        } else {
            edgeEntry = { x: nearest.x, y: nearest.y, isHead: true };
        }
        num--;
    }
    return {
        num,
        extensionPos: extPos,
        centralEntry,
        edgeEntry,
        isNewBranch: edgeEntry.isHead
    };
}

/**
 * 
 * @param {{x:number, y:number, eX:number, eY:number}[]} extPos
 * @param {{x:number, y:number, children:any[], isHead?:number, parentEntryX?:number, parentEntryY?:number}} cEntry
 * @param {{x:number, y:number, children:any[], isHead?:number, parentEntryX?:number, parentEntryY?:number}} eEntry
 * @param {*} planedExtensions 
 * @param {*} planedEntries 
 */
function updatePlan(extPos, cEntry, eEntry, planedExtensions, planedEntries) {
    let num = 0;
    // cEntry
    if (cEntry.y in planedExtensions[cEntry.x]) {
        delete planedExtensions[cEntry.x][cEntry.y];
        num--;
    }
    cEntry.parentEntryX = eEntry.x;
    cEntry.parentEntryY = eEntry.y;
    cEntry.children = [];
    planedEntries[cEntry.x][cEntry.y] = cEntry;
    // eEntry
    if (eEntry.y in planedExtensions[eEntry.x]) {
        delete planedExtensions[eEntry.x][eEntry.y];
        num--;
    }
    if (!(eEntry.y in planedEntries[eEntry.x])) {
        eEntry.children = [cEntry];
        planedEntries[eEntry.x][eEntry.y] = eEntry;
        if (!eEntry.isHead) {
            planedEntries[eEntry.parentEntryX][eEntry.parentEntryY].children.push(eEntry);
        }
    } else {
        eEntry.children.push(cEntry);
    }
    // extPos
    for (let pos of extPos) {
        if (!(pos.y in planedEntries[pos.x])) {
            planedExtensions[pos.x][pos.y] = pos;
            num++;
        }
    }
    return num;
}

function prune(center, planedExtensions, planedEntries, overflowNum) {
    let centralEntry = planedEntries[center.x][center.y], num = 0, closerExtensions = [];
    for (let x = center.x - 1; x <= center.x + 1; x++) {
        for (let y = center.y - 1; y <= center.y + 1; y++) {
            if (y in planedExtensions[x]) {
                if (!isNear(x, y, centralEntry.parentEntryX, centralEntry.parentEntryY)) {
                    delete planedExtensions[x][y];
                    num++;
                    if (num >= overflowNum) {
                        return num;
                    }
                } else {
                    closerExtensions.push({ x, y });
                }
            }
        }
    }
    if (num < overflowNum) {
        for (let { x, y } of closerExtensions) {
            delete planedExtensions[x][y];
            num++;
            if (num >= overflowNum) {
                break;
            }
        }
    }
    return num;
}

function placeExtensions(squares, costMat, planedExtensions, planedEntries, leftNum, acceptThreshold, reviewThreshold) {
    let newExtNum = 0, cost = 0, newBranches = [];
    for (let expectNum = 7; expectNum >= 0; expectNum--) {
        if (expectNum >= acceptThreshold) {
            for (let pos of squares[expectNum]) {
                let { num, extensionPos, centralEntry, edgeEntry, isNewBranch } = testSquare(pos.x, pos.y, costMat, planedExtensions, planedEntries, pos.blockX, pos.blockY, pos.blockCost);
                //console.log(JSON.stringify(pos), ':', num);
                if (num == expectNum) {
                    num = updatePlan(extensionPos, centralEntry, edgeEntry, planedExtensions, planedEntries);
                    cost += num * costMat[pos.x][pos.y];
                    newExtNum += num;
                    if (isNewBranch) {
                        edgeEntry.cost = costMat[pos.x][pos.y] - 1;
                        newBranches.push(edgeEntry);
                    }
                    if (newExtNum >= leftNum) {
                        if (newExtNum > leftNum) {
                            let pruned = prune(pos, planedExtensions, planedEntries, newExtNum - leftNum);
                            cost -= pruned * costMat[pos.x][pos.y];
                            newExtNum -= pruned;
                        }
                        return { newExtNum, newBranches, cost };
                    }
                } else if (num >= reviewThreshold) {
                    squares[num].push(pos);
                }
            }
        }
        squares[expectNum].length = 0;
    }
    return { newExtNum, newBranches, cost };
}

/**
 * 
 * @return {{newExtNum: number, newBranches: {x:number, y:number, ...}[], cost:number}}
 */
function placeSquares(square33, square32, costMat, planedExtensions, planedEntries, leftNum, acceptThreshold, reviewThreshold) {
    let { newExtNum, newBranches, cost } = placeExtensions(square33, costMat, planedExtensions, planedEntries, leftNum, acceptThreshold, reviewThreshold);
    if (newExtNum < leftNum) {
        let result = placeExtensions(square32, costMat, planedExtensions, planedEntries, leftNum - newExtNum, acceptThreshold, reviewThreshold);
        newExtNum += result.newExtNum;
        newBranches.push(...result.newBranches);
        cost += result.cost;
    }
    // console.log(`place squares: ${cost}`);
    return { newExtNum, newBranches, cost };
}

function addSquare(pos, square33, square32, map, costMat, layoutCost, planedExtensions, planedEntries) {
    let px = pos.x, py = pos.y;
    if (map[px + 1][py + 1] >= 3) { // map[2~49], px=1~48
        square33[testSquare(px, py, costMat, planedExtensions, planedEntries).num].push(pos);
    } else if ((map[px][py] >= 2) + (map[px + 1][py] >= 2) + (map[px][py + 1] >= 2) + (map[px + 1][py + 1] >= 2) == 3) {
        if (map[px][py] < 2) {  // 左上角被挡
            pos.blockX = px - 1;
            pos.blockY = py - 1;
            pos.blockCost = layoutCost[px - 1][py - 1] || 255;
        } else if (map[px + 1][py] < 2) { // 右上角被挡
            pos.blockX = pos.x + 1;
            pos.blockY = pos.y - 1;
            pos.blockCost = layoutCost[px + 1][py - 1] || 255;
        } else if (map[px][py + 1] < 2) {
            pos.blockX = pos.x - 1;
            pos.blockY = pos.y + 1;
            pos.blockCost = layoutCost[px - 1][py + 1] || 255;
        } else {
            pos.blockX = pos.x + 1;
            pos.blockY = pos.y + 1;
            pos.blockCost = layoutCost[px + 1][py + 1] || 255;
        }
        square32[testSquare(px, py, costMat, planedExtensions, planedEntries, pos.blockX, pos.blockY, pos.blockCost).num].push(pos);
    }
}

/**
 *  planedExtensions = {[x]:{[y]:extension}}   
 *  extension = {x:entry.x, y:entry.y}   
 *  planedEntries = {[x]:{[y]:entry}}   
 *  entry = {x, y, isHead?:bool, parentEntryX?:number, parentEntryY?:number}  
 *  entryRoots = {[x]:{[y]:1}}   
 *  square33: 3*3空地，索引是能额外摆放的extension数    
 *  square32：3个2*2空地，索引是能额外摆放的extension数，适应崎岖地形   
 * @param {{[x:number]:{[y:number]:number}}} map 
 * @param {*} terrain 
 */
function calExtensionPos(storagePos, map, terrain, layoutCost, acceptThreshold, reviewThreshold) {
    let { costMat, edgeSet } = initialCost(storagePos, 1, terrain, layoutCost);
    let planedExtensions = getEmptyMat(1, 48), planedEntries = getEmptyMat(1, 48), entryRoots = [];
    let planedExtNum = 0, totalCost = 0, result;
    let square33 = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    let square32 = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    let j50, px, py, prevCost;
    for (let pos of edgeSet) {
        px = pos.x;
        py = pos.y;
        if (costMat[px][py] != prevCost) {
            //console.log('prevCost:', prevCost, 'square33:', JSON.stringify(square33));
            result = placeSquares(square33, square32, costMat, planedExtensions, planedEntries, MAX_EXTENSIONS - planedExtNum, acceptThreshold, reviewThreshold);
            planedExtNum += result.newExtNum;
            //console.log(`place result: ${JSON.stringify(result)}`);
            totalCost += result.cost;
            if (result.newBranches.length) {
                for (let root of result.newBranches) {
                    entryRoots.push(root);
                }
            }
            if (planedExtNum >= MAX_EXTENSIONS || costMat[px][py] > config.maxExtensionDistance) {
                break;
            }
            prevCost = costMat[px][py];
        }
        for (let j = py - 1; j <= py + 1; j++) {
            if (j < 1 || j > 48) {
                continue;
            }
            j50 = j * 50;
            for (let i = px - 1; i <= px + 1; i++) {
                if (j in costMat[i] || i < 1 || i > 48 || terrain[j50 + i] & TERRAIN_MASK_WALL) {
                    continue;
                }
                edgeSet.push({
                    x: i,
                    y: j
                });
                costMat[i][j] = costMat[px][py] + 1;
            }
        }
        addSquare(pos, square33, square32, map, costMat, layoutCost, planedExtensions, planedEntries);
    }
    return {
        extensionPos: planedExtensions,
        roadPos: planedEntries,
        num: planedExtNum,
        entryRoots,
        totalCost
    };
}

/**
 *  在可选layout中选一个最好的，如果足够好就不再试下一个。不同layout相当于旋转
 * @param {*} anchor 
 * @param {*} terrain 
 * @param {*} map 
 * @param {RoomVisual} rv
 */
function tryLayouts(anchor, terrain, map, acceptThreshold, reviewThreshold, rv) {
    let minIdx, extensionPos, roadPos, entryRoots, num, minCost = 600, layoutCost;
    for (let idx = 0; idx < layouts.length; idx++) {
        //for (idx = 3; idx == idx; idx++) {
        let layout = layouts[idx]; // 取一个layout
        let tempMap = getTempMap(components[idx], anchor, map);
        let tempCost = getLayoutCost(anchor, layout);
        let storagePos = { x: layout[STRUCTURE_STORAGE][0].x + anchor.x, y: layout[STRUCTURE_STORAGE][0].y + anchor.y };
        let result = calExtensionPos(storagePos, map, terrain, tempCost, acceptThreshold, reviewThreshold);
        //console.log(JSON.stringify(extensionPos));
        //console.log(idx, result.num, result.totalCost);
        if (result.totalCost < minCost) {
            extensionPos = result.extensionPos;
            roadPos = result.roadPos;
            entryRoots = result.entryRoots;
            num = result.num;
            layoutCost = tempCost;
            minCost = result.totalCost;
            minIdx = idx;
        }
        /*         for (let x in tempMap) {
                    for (let y in tempMap[x]) {
                        rv.text(map[x][y], +x, +y, { color: global.colours.纯红, opacity: 1 });
                    }
                } */
        recoverMap(tempMap, map);
        //break;
    }
    /*    for (let x in layoutCost) {
           for (let y in layoutCost[x]) {
               rv.circle(+x, +y, { opacity: 0.5 });
               //rv.text(layoutCost[x][y], +x, +y, { color: global.colours.纯红, opacity: 1 });
           }
       }
       for (let x in extensionPos) {
           for (let y in extensionPos[x]) {
               //rv.circle(+x, +y, circleStyle[2]);
           }
       } */
    console.log(`finally cost:${minCost}`);
    return { idx: minIdx, extensionPos, roadPos, entryRoots, num, layoutCost };
}

/**
 * 
 * @param {RoomPosition} pos 
 * @param {any[]} goals 
 */
function removeGoal(pos, goals) {
    let goal;
    for (let idx = goals.length - 1; idx >= 0; idx--) {
        goal = goals[idx];
        if (isNear(pos.x, pos.y, goal.pos.x, goal.pos.y)) {
            goals.splice(idx, 1);
        }
    }
}

function findAllGoals(start, goals, pfCostMat, roads, extensionPos, rv) {
    let removed = 0, result, path, px, py;
    /**@type {PathFinderOpts} */
    let pfOpts = {
        maxRooms: 1,
        plainCost: 2,
        swampCost: 4,
        roomCallback: () => pfCostMat
    }
    while (goals.length) {
        result = PathFinder.search(start, goals, pfOpts);
        if (result.incomplete) {
            console.log(`Error: cannot find path to goals ${JSON.stringify(goals)}`);
            break;
        }
        path = result.path;
        removeGoal(path.pop(), goals);
        for (let pos of path) {
            px = pos.x;
            py = pos.y;
            roads[px][py] = 1;
            pfCostMat.set(px, py, 1);
            if (py in extensionPos[px]) {
                //rv.circle(pos.x, pos.y, circleStyle[4]);
                delete extensionPos[px][py];
                removed++;
            }
        }
    }
    return removed;
}

function findOneGoal(start, goals, pfCostMat, extensionPos, rv) {
    let removed = 0, result, path;
    /**@type {PathFinderOpts} */
    let pfOpts = {
        maxRooms: 1,
        plainCost: 1,
        swampCost: 2,
        roomCallback: () => pfCostMat
    }
    result = PathFinder.search(start, goals, pfOpts);
    if (result.incomplete) {
        console.log(`Error: cannot find path to goals ${JSON.stringify(goals)}`);
    } else {
        result.path.pop();  // 因为extensionPos从1~48，最后一格出口会越界
    }
    path = result.path;
    for (let pos of path) {
        if (pos.y in extensionPos[pos.x]) {     // 这里越界会报undefined
            //rv.circle(pos.x, pos.y, circleStyle[4]);
            delete extensionPos[pos.x][pos.y];
            removed++;
        }
    }
    return removed;
}

/**
 * 
 * @param {Room} room 
 * @param {RoomVisual} rv 
 */
function calRoads(room, start, layoutCost, extensionPos, roadPos, entryRoots, rv) {
    let roads = getEmptyMat(1, 48), pfCostMat = new PathFinder.CostMatrix;
    for (let x in layoutCost) {
        for (let y in layoutCost[x]) {
            if (layoutCost[x][y] == 1) {
                roads[x][y] = 1;
                pfCostMat.set(x, y, 1);
            } else {
                pfCostMat.set(x, y, 255);
            }
        }
    }
    for (let x in roadPos) {
        for (let y in roadPos[x]) {
            roads[x][y] = 1;
            pfCostMat.set(x, y, 1);
        }
    }
    for (let x in extensionPos) {
        for (let y in extensionPos[x]) {
            pfCostMat.set(x, y, EXTENSION_COST);
        }
    }
    let goals = entryRoots.map(root => ({ pos: { x: root.x, y: root.y, roomName: room.name }, range: 0 }));
    //console.log('start:', JSON.stringify(start));
    let removedNum = findAllGoals(start, goals, pfCostMat, roads, extensionPos);
    let goalObjects = room.source;
    goalObjects.push(room.controller);
    if (room.mineral) {
        goalObjects.push(room.mineral);
    }
    goals = goalObjects.map(o => ({ pos: o.pos, range: 1 }));
    //console.log(JSON.stringify(goals));
    removedNum += findAllGoals(start, goals, pfCostMat, roads, extensionPos, rv);
    for (let dir of [FIND_EXIT_TOP, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT, FIND_EXIT_RIGHT]) {
        let exits = room.find(dir);
        if (exits.length) {
            goals = exits;
            removedNum += findOneGoal(start, goals, pfCostMat, extensionPos, rv);
        }
    }
    return { removedNum, roads };
}

function placeAround(canPlacePos, extensionPos, num) {
    let placedNum = 0;
    for (let i = canPlacePos.length - 1; i >= 0; i--) {
        let { x, y } = canPlacePos.pop();
        extensionPos[x][y] = 1;
        placedNum++;
        if (placedNum >= num) {
            break;
        }
    }
    return placedNum;
}

function placeAlongRoad(storagePos, terrain, layoutCost, roads, extensionPos, entryPos, entryRoots, num) {
    let { costMat, edgeSet } = initialCost(storagePos, 1, terrain, layoutCost);
    let px, py, placedNum = 0, cost, parent, canPlacePos = [], obPos;
    for (let pos of edgeSet) {
        px = pos.x, py = pos.y;
        cost = costMat[px][py];
        parent = false;
        canPlacePos.length = 0;
        for (let x = px - 1; x <= px + 1; x++) {
            for (let y = py - 1; y <= py + 1; y++) {
                if (y in roads[x]) {
                    if (!(y in costMat[x])) {
                        costMat[x][y] = cost + 1;
                        edgeSet.push({ x, y });
                    }
                    if (y in entryPos[x]) {
                        if (costMat[x][y] < cost) {
                            parent = entryPos[x][y];
                        }
                    }
                } else if (!(terrain[y * 50 + x] & TERRAIN_MASK_WALL) && !(y in extensionPos[x]) && !(y in layoutCost[x])) {
                    canPlacePos.push({ x, y });
                }
            }
        }
        if (canPlacePos.length) {
            if (placedNum < num) {
                if (py in entryPos[px] || parent) {
                    if (!(py in entryPos[px])) {
                        let newEntry = { x: px, y: py, parentEntryX: parent.x, parentEntryY: parent.y };
                        parent.children.push(newEntry);
                        entryPos[px][py] = newEntry;
                    }
                    placedNum += placeAround(canPlacePos, extensionPos, num - placedNum);
                } else if (canPlacePos.length >= 3 || num - placedNum <= canPlacePos) {
                    entryPos[px][py] = { x: px, y: py, isHead: true, cost };
                    entryRoots.push(entryPos[px][py]);
                    placedNum += placeAround(canPlacePos, extensionPos, num - placedNum);
                }
                if (obPos && obPos.y in extensionPos[obPos.x]) {    // 新摆的ext把之前ob占了
                    obPos = false;
                }
            }
            if (canPlacePos.length) {
                obPos = canPlacePos[0];
            }
            if (placedNum >= num && obPos) {
                return { placedNum, obPos };
            }
        }
    }
    throw new Error(`cannot place all extension an ob: ${placedNum}, ${JSON.stringify(obPos)}`);
}

/**
 * 
 * @param {RoomVisual} rv 
 */
function showBetter(roads, idx, bestAnchor, obPos, extensionPos, rv) {
    for (let x in roads) {
        for (let y in roads[x]) {
            rv.structure(+x, +y, STRUCTURE_ROAD);
        }
    }
    rv.connectRoads();
    for (let type in layouts[idx]) {
        for (let s of layouts[idx][type]) {
            rv.structure(s.x + bestAnchor.x, s.y + bestAnchor.y, type);
        }
    }
    rv.structure(obPos.x, obPos.y, STRUCTURE_OBSERVER);
    let num = 1;
    for (let x in extensionPos) {
        for (let y in extensionPos[x]) {
            rv.structure(+x, +y, STRUCTURE_EXTENSION);
            rv.text(num, +x, +y, { color: global.colours.金色, opacity: 1, font: 0.6 });
            num++;
        }
    }
}

/**
 * @param {RoomVisual} rv
 */
function show(roads, idx, bestAnchor, obPos, extensionPos, rv) {
    for (let x in roads) {
        for (let y in roads[x]) {
            rv.circle(+x, +y, circleStyle[3]);
        }
    }
    rv.connectRoads();
    for (let type in layouts[idx]) {
        if (type != STRUCTURE_ROAD) {
            for (let s of layouts[idx][type]) {
                rv.circle(s.x + bestAnchor.x, s.y + bestAnchor.y, circleStyle[4]);
            }
        }
    }
    rv.circle(obPos.x, obPos.y, circleStyle[4]);
    let num = 1;
    for (let x in extensionPos) {
        for (let y in extensionPos[x]) {
            rv.circle(+x, +y, circleStyle[2]);
            rv.text(num, +x, +y, { color: global.colours.橘红, opacity: 1, font: 0.6 });
            num++;
        }
    }
}

/**
 * 
 * @param {Room|string} room 
 * @param {boolean} showPlan 可选参数，显示结果
 * @param {number} acceptThreshold 可选参数，1~7，默认2，控制extension分布
 * @param {number} reviewThreshold 可选参数，1~7，默认3，控制extension分布
 */
function plan(room, showPlan, acceptThreshold, reviewThreshold) {
    if (typeof room == typeof '') {
        room = Game.rooms[room];
    }
    if (!(room instanceof Room) || !room.controller) {
        return false;
    }
    room.source = room.source || room.find(FIND_SOURCES);   // TODO:为了适应没有我的建筑缓存
    room.mineral = room.mineral || room.find(FIND_MINERALS)[0];  // TODO
    showPlan = showPlan === undefined || showPlan;  // 默认值设true
    let terrain = room.getTerrain().getRawBuffer();
    let costMats = getCostMats(room, terrain);

    let rv = new RoomVisual(room.name);
    /*     for (x in costMats[3]) {
            for (y in costMats[3][x]) {
                rv.text(costMats[3][x][y], +x, +y, {
                    opacity: 0.5
                });
            }
        } */

    let { map, bestAnchor } = calSquare(room, terrain, config.layoutSize, rv, costMats);
    if (bestAnchor.cost == 999) {
        console.log('cannot find anchor');
        return false;
    }
    //console.log(rv, rv.text);
    let { idx, extensionPos, entryRoots, roadPos, num, layoutCost } = tryLayouts(bestAnchor, terrain, map, acceptThreshold || config.acceptThreshold, reviewThreshold || config.reviewThreshold, rv);
    console.log(`best layout: ${idx}, num: ${num}`);

    let storage = layouts[idx]['storage'][0];
    let startPos = { x: storage.x + bestAnchor.x, y: storage.y + bestAnchor.y, roomName: room.name };
    let { removedNum, roads } = calRoads(room, startPos, layoutCost, extensionPos, roadPos, entryRoots, rv);
    //console.log(`removed: ${removedNum}`);

    let { placedNum, obPos } = placeAlongRoad(startPos, terrain, layoutCost, roads, extensionPos, roadPos, entryRoots, MAX_EXTENSIONS - num + removedNum);

    if (showPlan) {
        if (rv.structure) {
            showBetter(roads, idx, bestAnchor, obPos, extensionPos, rv);
        } else {
            console.log('快去群里下载先进作图工具（RoomVisual.js）');
            show(roads, idx, bestAnchor, obPos, extensionPos, rv);
        }
    }

    return num - removedNum + placedNum;
}

/**
 * @param {RoomVisual} rv 
 */
function findComponents(structures, anchorPos, rv) {
    let layout = getEmptyMat(1, 48), comp = [], size;
    const UNSOLVED = 1, SOLVED = 2;
    for (let type in structures) {
        for (let s of structures[type]) {
            layout[s.pos.x][s.pos.y] = UNSOLVED;
        }
    }
    for (let x in layout) {
        for (let y in layout[x]) {
            if (layout[x][y] == UNSOLVED) {
                for (size = 0; size + (+x) < 49 && size + (+y) < 49; size++) {
                    let incomplete = false;
                    for (let i = 0; i <= size; i++) {
                        if (!(+y + i in layout[+x + size]) || !(+y + size in layout[+x + i])) {
                            incomplete = true;
                            break;
                        }
                    }
                    if (incomplete) {
                        size--;
                        break;
                    }
                }
                for (let i = 0; i <= size; i++) {
                    layout[+x + size][+y + i] = SOLVED;
                    layout[+x + i][+y + size] = SOLVED;
                }
                rv.rect(x - 0.5, y - 0.5, size + 1, size + 1, { opacity: 0.3, fill: global.colours.纯绿 });
                comp.push({ x: x - anchorPos.x + size, y: y - anchorPos.y + size, offset: size });
            }
        }
    }
    return JSON.stringify(comp);
}

/**
 * 
 * @param {Room} room 
 */
function parseLayout(room) {
    if (typeof room == typeof '') {
        room = Game.rooms[room];
    }
    if (!(room instanceof Room) || !Game.flags.anchor) {
        return false;
    }
    let structures = _.groupBy(room.find(FIND_STRUCTURES, { filter: s => s.structureType != STRUCTURE_CONTROLLER }), s => s.structureType);
    let text = '{\n';
    let anchorPos = Game.flags.anchor.pos;
    for (let type in structures) {
        text += `    ${type}: ${JSON.stringify(structures[type].map((s) => ({ x: s.pos.x - anchorPos.x, y: s.pos.y - anchorPos.y })))},\n`;
    }
    text += '}\n';
    text += 'component: ' + findComponents(structures, anchorPos, room.visual);
    return text;
}

global.parse = parseLayout;
global.RP = plan;

module.exports = { parse: parseLayout, plan };