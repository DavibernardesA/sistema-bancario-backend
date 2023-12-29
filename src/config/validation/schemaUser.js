const validateBodyRequest = joiSchema => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.body)
    next()

  } catch (err) {
    return res.status(400).json({ message: err.message })
  }
}

module.exports = {
  validateBodyRequest
}
