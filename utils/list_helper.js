const _ = require('lodash');


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

const blogs = [
{
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 2,
    __v: 0
},
{
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 7,
    __v: 0
},
{
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 9,
    __v: 0
},
{
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 21,
    __v: 0
}]

const favoriteBlog = (blogs) => {


    if (!blogs || blogs.length === 0) {
        return 0
    }
    return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)


}



const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null;  // Если нет блогов, возвращаем null
    }

    // Группируем блоги по авторам
    const authorGroups = _.groupBy(blogs, 'author');

    // Считаем количество блогов для каждого автора
    const authorBlogCounts = _.map(authorGroups, (blogs, author) => {
        return { author, blogsCount: blogs.length };
    });

    // Находим автора с максимальным количеством блогов
    return _.maxBy(authorBlogCounts, 'blogsCount');
};
  
console.log(mostBlogs(blogs));



const mostLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null;  // Если нет блогов, возвращаем null
    }

    // Группируем блоги по авторам
    const authorGroups = _.groupBy(blogs, 'author');

    // Суммируем лайки для каждого автора
    const authorLikes = _.map(authorGroups, (blogs, author) => {
        const totalLikes = _.sumBy(blogs, 'likes');  // Суммируем лайки каждого блога автора
        return { author, totalLikes };
    });

    // Находим автора с максимальным количеством лайков
    return _.maxBy(authorLikes, 'totalLikes');
};

// Пример использования:


console.log(mostLikes(blogs));
// Вывод: { author: 'John', totalLikes: 60 }




module.exports = {
    dummy,
    totalLikes,
    maxLikes,
    favoriteBlog
}