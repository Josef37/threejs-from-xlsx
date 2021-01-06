const fs = require('fs')
const path = require('path')
const { XlsParser } = require('simple-excel-to-json')

const SECONDS_PER_DAY = 24 * 60 * 60

const json = (new XlsParser()).parseXls2Json(path.resolve(__dirname, 'data.xlsx'));
const data = json[0].map((item) => ({
    time: item.TimeId * SECONDS_PER_DAY,
    rotX: deg2Rad(item.Gyro_X),
    rotY: deg2Rad(item.Gyro_Y),
    rotZ: deg2Rad(item.Gyro_Z),
    accX: item.Accelero_X,
    accY: item.Accelero_Y,
    accZ: item.Accelero_Z,
}))
fs.writeFileSync(path.resolve(__dirname, 'data.json'), JSON.stringify(data, null, 4))

function deg2Rad(angle) {
    return angle * Math.PI / 180
}
