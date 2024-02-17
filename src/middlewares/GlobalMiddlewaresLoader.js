import measurePerformance from './PerformanceMeasurementMiddleware.js'
import helmet from 'helmet'
import cors from 'cors'
import express from 'express'

const loadGlobalMiddlewares = (app) => {
  app.use(express.json())
  app.use(cors())
  app.use(helmet(
    {
      crossOriginResourcePolicy: false // allows loading of files from /public
    }
  ))
  app.use(measurePerformance)
}

export default loadGlobalMiddlewares
