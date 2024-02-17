const checkEntityExists = (entityService, idPathParamName) => async (req, res, next) => {
  try {
    const entity = await entityService.exists(req.params[idPathParamName])
    if (!entity) { return res.status(404).send('Not found') }
    return next()
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send(err)
    }
    return res.status(500).send(err.message)
  }
}

export { checkEntityExists }
