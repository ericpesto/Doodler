# Doodler ReadMe 
## Team members
* [Eric Petsopoulos](https://github.com/ericpesto)
* [Sami Hakim](https://github.com/hamisakim)
* [Aida Bourdis](https://github.com/lesroissamusent)
* [Ayo Olawoye](https://github.com/ayoolawoye)

## Deployed app here [Doodler](https://doodler.netlify.app/)
Create an account and login to see the full features! 
# Project Overview - 7 days
*Note - no extra work has been done to this apart from deployment. This is to give an accurate representation of what can be accomplished in a set time frame.

Doodler is a social site for users to create and share their doodles. 

![Screenshot 2021-05-04 at 15 51 55](https://user-images.githubusercontent.com/76621344/117348412-137fa700-aea2-11eb-90ad-4ff23aa95cb2.png)



# Initialisation

* Make sure mongoDB is running  `mongod --dbpath ~/data/db`
* Server directory  `cd backend`
* `yarn`
* `yarn seed`
* `yarn serve`
* Front end  `cd client`
* Install front-end dependencies: `yarn`
* Start front-end server: `yarn start`

# Project brief
* **Build a full-stack application** by making your own backend and your own front-end
* **Use a MongoDB and Node.js API** using express framework to serve your data from a MongoDB database
* **Consume your API with a separate front-end** built with React
* **Be a complete product** 
* **Be deployed online** so it’s publicly accessible
# Technologies Used
* MongoDB/Mongoose
* Express
* React.js (hooks)
* Node.js
* SCSS
* Bulma
* Axios
* Nodemon
* HTTP-proxy-middleware
* Bcrypt
* Body-parser
* jsonwebtoken
* Git/GitHub

## Approach Taken 
While discussing ideas we found a [ canvas component](https://www.npmjs.com/package/react-canvas-draw) that allows users to make a doodle. We knew we wanted this as the focus of our app and got to work. 

We met and had some wireframes drawn up of how we want the app to look like.

![Screenshot 2021-05-04 at 15 02 14](https://user-images.githubusercontent.com/76621344/117348437-1a0e1e80-aea2-11eb-8287-a1e3156a1921.png)


![Screenshot 2021-05-04 at 15 02 36](https://user-images.githubusercontent.com/76621344/117348444-1c707880-aea2-11eb-83ee-f096a15ae167.png)


![Screenshot 2021-05-04 at 15 02 51](https://user-images.githubusercontent.com/76621344/117348460-1ed2d280-aea2-11eb-8fda-6d2f6c147547.png)

We used Trello to track our progress and raise issues.

![Screenshot 2021-05-04 at 15 05 33](https://user-images.githubusercontent.com/76621344/117348477-22665980-aea2-11eb-8a7b-09686ee5f6e8.png)



# Backend development
The doodles are referred as artwork in our schematics. They contain both embedded and reference relationships.
## Schemas
``` javascript
const commentSchema = new mongoose.Schema({
  commentText: { type: String, required: false }, //! Sami change to false for star rating 
  rating: { type: Number, required: false, min: 1, max: 5 },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: false },
  username: { type: String , required: false }
},
{ timestamps: true
})

const favouriteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: false }
},
{ timestamps: true }
)

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 60 },
  description: { type: String, required: false, maxlength: 500 },
  doodleData: { type: String, required: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true  },
  comments: [commentSchema],
  favourites: [ favouriteSchema ]
},
{ timestamps: true }
)
```

## Controllers
Example of controller for liking / adding to favourites.
``` javascript
export const addLike = async (req, res) => {
// const currentUser = req.currentUser._id
  try {
    const { id } = req.params
    const artworkToLike = await Artwork.findById(id)
    if (!artworkToLike) {
      throw new Error('🟥 no artwork found to like 🟥 ')
    }
    const newLike = { owner: req.currentUser }
    const favouritesArray = artworkToLike.favourites 
    const currentUserLoggedInId = JSON.stringify(req.currentUser._id)
    const hasUserLikedBefore = await favouritesArray.find(item => JSON.stringify(item.owner._id) === currentUserLoggedInId) 
    
    console.log('🐝 ~ file: artworkController.js ~ line 107 ~ hasUserLikedBefore', hasUserLikedBefore)
    if (hasUserLikedBefore) {
      const likeToRemove = await artworkToLike.favourites.id(hasUserLikedBefore._id)
      await likeToRemove.remove()
      await	artworkToLike.save()
      res.status(200).json( { message: 'Dis-liked!' })
    } else if (!hasUserLikedBefore) {
      artworkToLike.favourites.push(newLike)
      await	artworkToLike.save()
      res.status(200).json( { message: 'liked!' })
    }
  } catch (err) {
    console.log('🐝 ~ file: artworkController.js ~ line 128 ~ error', err)
    res.status(500).json( { message: err.message })
  }
}
```
* We ran into a problem often with the payload size but managed to overcome this! By using [lz-string: everything to make it work for you - pieroxy.net](https://pieroxy.net/blog/pages/lz-string/guide.html)
![Screenshot_2021-03-25_at_23 28 40](https://user-images.githubusercontent.com/76621344/117348576-42961880-aea2-11eb-9be7-66f7e35d2cb9.png)
* this changed the data from an object with line coordinates to a single string .
![Screenshot 2021-05-06 at 19 22 27](https://user-images.githubusercontent.com/76621344/117348601-4de94400-aea2-11eb-9113-afcd3f2a803a.png)




!![Screenshot 2021-05-06 at 19 22 59](https://user-images.githubusercontent.com/76621344/117348618-52adf800-aea2-11eb-8717-aa638f19ef7f.png)


## Like feauture 
The like button was something I focused on, front and back-end. 
This will check if the user has liked previously and dislike if so, or add a like if not.
```javascript
export const addLike = async (req, res) => {
// const currentUser = req.currentUser._id
  try {
    const { id } = req.params
    const artworkToLike = await Artwork.findById(id)
    if (!artworkToLike) {
      throw new Error('🟥 no artwork found to like 🟥 ')
    }
    const newLike = { owner: req.currentUser }
    const favouritesArray = artworkToLike.favourites 
    const currentUserLoggedInId = JSON.stringify(req.currentUser._id)
    const hasUserLikedBefore = await favouritesArray.find(item => JSON.stringify(item.owner._id) === currentUserLoggedInId) 
    
    console.log('🐝 ~ file: artworkController.js ~ line 107 ~ hasUserLikedBefore', hasUserLikedBefore)
    if (hasUserLikedBefore) {
      const likeToRemove = await artworkToLike.favourites.id(hasUserLikedBefore._id)
      await likeToRemove.remove()
      await	artworkToLike.save()
      res.status(200).json( { message: 'Dis-liked!' })
    } else if (!hasUserLikedBefore) {
      artworkToLike.favourites.push(newLike)
      await	artworkToLike.save()
      res.status(200).json( { message: 'liked!' })
    }
  } catch (err) {
    console.log('🐝 ~ file: artworkController.js ~ line 128 ~ error', err)
    res.status(500).json( { message: err.message })
  }
}
```


# Front end
My focus was on the gallery page, user authentication and the like and comment features.

# My Highlights
## Comments

The comment feed component uses the doodle ID to get all its comments and formats the timestamp to display a comment feed. Using an interval this refreshes every five seconds. 

```javascript
const CommentFeed = ({ _id }) => {
  const [commentsArray, setCommentsArray] = useState([])
  useEffect(() => {
    getComments()
    const interval = setInterval(getComments, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const getComments = async () =>{ 
    const response = await axios.get(`/api/artwork/${_id}/getComments`) 
    const newCommentsArray = response.data
    setCommentsArray(newCommentsArray)
  }
  const formattedTimestamp = (timestamp) =>{
    const date = new Date(timestamp)
    const toString = date.toString()
    const dateSlice = toString.slice(4,10)
    const timeSlice = toString.slice(15,21)
    return `${dateSlice} at ${timeSlice}`
  }
```
To add comments - this will also take a user rating, between 1-5 and add this to the doodle.
```javascript
const CommentForm = ({ _id }) => {
  const [userComment, setUserComment] = useState({
    commentText: '',
    rating: 1
  })
  const [userRating, setUserRating] = useState(null)
  
  const [isThereComment, setIsThereComment] = useState(null)
  const [isThereRating, setIsThereRating] = useState(null)
  console.log('🐝 ~ file: CommentForm.js ~ line 25 ~ isThereRating', isThereRating)



  const handleCommentChange = (event) => {
    //?get the value of what's being typed in the form and updating state
    const newUserComment = { ...userComment, [event.target.name]: event.target.value }
    // console.log('🐝 ~ file: Login.js ~ line 25 ~ event', event)
    setUserComment(newUserComment)
  }

  const handleRatingChange = (event) => {
    console.log('🐝 ~ file: CommentForm.js ~ line 65 ~ event', event)
    setIsThereRating(true)
    setUserRating(event)
  }


  const handleCommentPost = async(event) => {
    event.preventDefault()
    const isThereComment = !!userComment.commentText
    if (!userIsAuthenticated()) {
      userNeedsToLogin('Please login to review and comment!☺️')
    }
    if (!isThereComment) {
      setIsThereComment(false)
      console.log('NO COMMENT')
      commentPopup(0)
      return 0
    } if (!isThereRating) {
      ratingPopup(false)
      return 0
    }
    try {
      const commentToAdd = { ...userComment, rating: userRating }
      await axios.post(`/api/${_id}/comment`, commentToAdd, { headers: { Authorization: `Bearer ${getTokenFromLocalStorage()}` } } )
      console.log('🐝 ~ file: CommentForm.js ~ line 23 ~ commentToAdd', commentToAdd)
      commentPopup(true)
      setUserComment({ commentText: '' })
    } catch (err) {
      console.log('🔴 ~ file: CommentForm.js ~ line 24 ~ err', err)
    }
  }
  ```



![Screenshot 2021-05-24 at 16 18 13](https://user-images.githubusercontent.com/76621344/119369063-a6df1780-bcab-11eb-8cf8-5ff51af01970.png)

I really Like how the gallery page turned out with the cards and getting the filter feature to work.
![Screenshot 2021-05-04 at 15 48 33](https://user-images.githubusercontent.com/76621344/117348638-5a6d9c80-aea2-11eb-9ceb-ce6f0a46ac69.png)


# Wins and Challenges
## Challenges 😧
* Managing and splitting work proved challenging initially!
* Merging and solving conflicts was something we had to learn on the fly and practice.  

## Wins 🏆
* Working as a team to create a really cool interactive app!
* happy to get a working like button which updates correctly

# Key Learnings
* Using GitHub with others on a project.
* Splitting workload with team.
* Using SVGs.

# Final product walkthrough
![Screenshot 2021-05-24 at 16 49 13](https://user-images.githubusercontent.com/76621344/119373117-fa536480-bcaf-11eb-83c7-6f0c4f3edf0c.png)
![Screenshot 2021-05-24 at 16 50 28](https://user-images.githubusercontent.com/76621344/119373282-25d64f00-bcb0-11eb-99b9-9f3bb4d056ef.png)
![Screenshot 2021-05-24 at 16 50 51](https://user-images.githubusercontent.com/76621344/119373336-34bd0180-bcb0-11eb-89c8-259976ab4e84.png)
![Screenshot 2021-05-24 at 16 51 15](https://user-images.githubusercontent.com/76621344/119373375-42728700-bcb0-11eb-8aa5-a267222450ee.png)
![Screenshot 2021-05-24 at 16 51 45](https://user-images.githubusercontent.com/76621344/119373447-55855700-bcb0-11eb-9a14-10a73ac52116.png)



