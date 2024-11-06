
const dummy = () => {
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

// const blogs = [
// {
//     _id: '5a422aa71b54a676234d17f8',
//     title: 'Go To Statement Considered Harmful',
//     author: 'Edsger W. Dijkstra',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 2,
//     __v: 0
// },
// {
//     _id: '5a422aa71b54a676234d17f8',
//     title: 'Go To Statement Considered Harmful',
//     author: 'Edsger W. Dijkstra',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 7,
//     __v: 0
// },
// {
//     _id: '5a422aa71b54a676234d17f8',
//     title: 'Go To Statement Considered Harmful',
//     author: 'Edsger W. Dijkstra',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 9,
//     __v: 0
// },
// {
//     _id: '5a422aa71b54a676234d17f8',
//     title: 'Go To Statement Considered Harmful',
//     author: 'Edsger W. Dijkstra',
//     url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//     likes: 21,
//     __v: 0
// }]

const favoriteBlog = (blogs) => {


    if (!blogs || blogs.length === 0) {
        return 0
    }
    return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)


}




  

module.exports = {
    dummy,
    totalLikes,
    maxLikes,
    favoriteBlog
}