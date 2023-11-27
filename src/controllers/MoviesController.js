const { request } = require("express")
const knex = require("../database/knex")

class MoviesController {
  async create(request, response) {
    const { movie, description, rating, movieTags, movieUrl } = request.body
    const { user_id } = request.params

    const [movie_id] = await knex("movies").insert({
      movie,
      description,
      rating,
      user_id
    })
  

    const linksInsert = movieUrl.map(link => {
      return {
        movie_id,
        movieUrl: link
      }
    })

    await knex("movieLinks").insert(linksInsert)

    const tagsInsert = movieTags.map(movieTag => {
      return {
        movie_id,
        movieTag,
        user_id
      }
    })

    await knex("movieTags").insert(tagsInsert)

    response.json()
  }

  async show(request,response){
    const { id } = request.params
    console.log(id)
    const movie = await knex("movies").where({ id }).first()
    console.log(movie)
    const tags = await knex("movieTags").where({ movie_id: id }).orderBy("movieTag")
    const links = await knex("movieLinks").where({ movie_id: id }).orderBy("created_at")


    return response.json({
      ...movie,
      tags,
      links})
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("movies").where({ user_id: id }).delete()

    return response.json()
  }

  async index(request, response) {
    console.log("oi")
    const { movie, user_id, movieTag } = request.query
    
    let movies
    console.log(movieTag)

    if (movieTag) { 
      const filterTags = movieTag.split(',').map(tag => tag.trim())

      console.log(filterTags)

      movies = await knex("movieTags")
      .select([ 
        "movies.id",
        "movies.movie",
        "movies.user_id"
      ])
      .where("movies.user_id", user_id)
      .whereLike("movies.movie", `%${movie}%` )
      .whereIn("movieTag", filterTags)
      .innerJoin("movies", "movies.id", "movieTags.movie_id")
      .orderBy("movies.movie")
    } 
    else {
      const movies = await knex("movies")
      .where({ user_id : id})
      .whereLike("movie", `%${movie}%`)
      .orderBy("movie")
    }

    const userTags = await knex("movieTags").where({ user_id })
    console.log("userTags", userTags)
    const moviesWithTags = movies.map(movie => {
      const withTags = userTags.filter(tag => movieTag.movie_id === movies.id)
      return {
        ...movie,
        tags: withTags
      }
    } )

    return response.json(moviesWithTags)
  }
}

module.exports = MoviesController