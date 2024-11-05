
const dummy = (blogs) => {
    return 1
}
    

const totalLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return 0
    }
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const maxLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return 0
    }
    return Math.max(...blogs.map(blog => blog.likes))
}


module.exports = {
    dummy,
    totalLikes,
    maxLikes
}