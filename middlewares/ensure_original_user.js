function ensureOriginalUser(req, res, next) {

    next()
}

module.exports = ensureOriginalUser

// if req.params.userid = req.sesions.userId, then display options to edit 