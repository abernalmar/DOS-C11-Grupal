import path from 'path'
import moment from 'moment'

import fs from 'fs'

const saveToCSV = (csvFilePath, method, endpoint, duration) => {
  const row = `${method},${endpoint},${duration}\n`
  fs.appendFile(csvFilePath, row, 'utf8', function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.')
    }
  })
}
const initializeCSVFile = () => {
  const performanceMeasurementsDirName = './performanceMeasurements/logs'
  if (!fs.existsSync(performanceMeasurementsDirName)) {
    fs.mkdirSync(performanceMeasurementsDirName, { recursive: true })
  }
  const formattedDate = moment().format('YYYY-MM-DD-HH-mm-ss')
  const csvFilePath = path.resolve(performanceMeasurementsDirName, `${process.env.DATABASE_TECHNOLOGY}-${process.env.DATABASE_PROTOCOL}-${formattedDate}.csv`)
  saveToCSV(csvFilePath, 'method', 'endpoint', 'duration(ms)')
  return csvFilePath
}

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

const csvFilePath = initializeCSVFile()

const measurePerformance = (req, res, next) => {
  // console.log(`${req.method} ${req.originalUrl} [STARTED]`)
  const start = process.hrtime()

  res.on('finish', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start)
    // console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
    saveToCSV(csvFilePath, req.method, req.route?.path, durationInMilliseconds)
  })
  /* When the client closes the connection
  res.on('close', () => {
    const durationInMilliseconds = getDurationInMilliseconds(start)
    console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
  })
 */
  next()
}

export default measurePerformance
