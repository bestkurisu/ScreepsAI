const builder = require('role.builder')
const upgrader = require('role.upgrader')
const harvester = require('role.harvester')
const centertransporter = require('role.centertransporter')
const claimer = require('role.claimer')
const defender = require('role.defender')
const labman = require('role.labman')
const spawntrans = require('role.spawntrans')
const transporter = require('role.transporter')
const wallrepairer = require('role.wallrepairer')
const attacker = require('role.attacker')
const depo = require('role.depo')
const pba = require('role.pba')
const pbb = require('role.pbb')
const pbc = require('role.pbc')
const scout = require('role.scout')
const dismantler = require('role.dismantler')
const faker = require('role.faker')
const healer = require('role.healer')
const pc = require('powercreep')
const longbuilder = require('role.longbuilder')
const worker = require('role.worker')
const lorry = require('role.lorry')

// creep角色配置文件
module.exports = {
    worker0: worker('Flag17'),
    worker1: worker('Flag18'),

    builder0: builder('W29N4'),
    builder1: builder('W29N6'),
    builder2: builder('W29N5'),
    builder3: builder('W28N6'),
    builder4: builder('W31S9'),
    builder5: builder('W29S5'),

    upgrader0: upgrader('W29N4'),
    upgrader1: upgrader('W29N6'),
    upgrader2: upgrader('W29N5'),
    upgrader3: upgrader('W28N6'),
    upgrader4: upgrader('W31S9'),
    upgrader5: upgrader('W29S5'),

    harvester0: harvester('Flag0'),
    harvester1: harvester('Flag1'),
    harvester2: harvester('Flag2'),
    harvester3: harvester('Flag3'),
    harvester4: harvester('Flag4'),
    harvester5: harvester('Flag5'),
    harvester6: harvester('Flag6'),
    harvester7: harvester('Flag7'),
    harvester8: harvester('Flag8'),
    harvester9: harvester('Flag9'),
    harvester10: harvester('Flag10'),
    harvester11: harvester('Flag11'),
    harvester12: harvester('Flag12'),
    harvester13: harvester('Flag13'),
    harvester14: harvester('Flag14'),
    harvester15: harvester('Flag15'),
    harvester16: harvester('Flag16'),
    harvester17: harvester('Flag17'),
    harvester18: harvester('Flag18'),
    harvester19: harvester('Flag19'),
    harvester20: harvester('Flag20'),

    centertransporter0: centertransporter('W29N4'),
    centertransporter1: centertransporter('W29N6'),
    centertransporter2: centertransporter('W29N5'),
    centertransporter3: centertransporter('W28N6'),
    centertransporter4: centertransporter('W31S9'),
    centertransporter5: centertransporter('W29S5'),

    claimer0: claimer('W31N6'),
    claimer1: claimer('W31N4'),
    claimer2: claimer('W28N5'),
    claimer3: claimer('W29N7'),

    labman0: labman('W29N4'),
    labman1: labman('W29N6'),
    labman2: labman('W29N5'),
    labman3: labman('W26N7'),
    labman4: labman('W31S9'),
    labman5: labman('W29S5'),

    spawntrans0: spawntrans('W29N4'),
    spawntrans1: spawntrans('W29N6'),
    spawntrans2: spawntrans('W29N5'),
    spawntrans3: spawntrans('W28N6'),
    spawntrans4: spawntrans('W31S9'),
    spawntrans5: spawntrans('W29S5'),

    transporter0: transporter('W29N4'),
    transporter1: transporter('W29N6'),
    transporter2: transporter('W31S9'),
    transporter3: transporter('W29N5'),
    transporter4: transporter('W29S5'),

    wallrepairer0: wallrepairer('W29N4'),
    wallrepairer1: wallrepairer('W29N6'),
    wallrepairer2: wallrepairer('W29N5'),
    wallrepairer3: wallrepairer('W28N6'),
    wallrepairer4: wallrepairer('W31S9'),
    
    defender0: defender('W29N3'),
    defender1: defender('W28N3'),
    defender3: defender('W29N7'),
    defender4: defender('W28N6'),

    depo0: depo('depo0'),
    depo1: depo('depo1'),
    depo2: depo('depo2'),
    depo3: depo('depo3'),
    depo4: depo('depo4'),
    depo5: depo('depo5'),
    depo6: depo('depo6'),
    depo7: depo('depo7'),

    pba0: pba('pb0'),
    pbb0: pbb('pb0'),
    pbc0: pbc('pb0'),

    pba1: pba('pb1'),
    pbb1: pbb('pb1'),
    pbc1: pbc('pb1'),

    scout0: scout(),
    longbuilder: longbuilder(),
    lorry0: lorry('flag'),

    'YoRHa-6o': pc('YoRHa-6o'),
    'YoRHa-4o': pc('YoRHa-4o'),
    'YoRHa-8o': pc('YoRHa-8o'),
    'YoRHa-7o': pc('YoRHa-7o'),
};