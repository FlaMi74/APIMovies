const { Router } = require("express")

const usersRouter = require("./users.routes")
const moviesRouter = require("./movies.routes")
const tagsRouter = require("./movieTags.routes")
const routes = Router()

routes.use("/users", usersRouter)
routes.use("/movies", moviesRouter)
routes.use("/movieTags", tagsRouter)

module.exports = routes