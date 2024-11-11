# part4-1
Exercises 4.1-4.2

 Let's separate all printing to the console to its own module utils/logger.js:
 ```javascript
 const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
 ```

The handling of environment variables is extracted into a separate utils/config.js file:
```javascript
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}

```
The other parts of the application can access the environment variables by importing the configuration module:

```js
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)
```
The contents of the index.js file used for starting the application gets simplified as follows:

```js
const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

```

All of the routes related to notes are now in the notes.js module under the controllers directory. controllers/notes.js:
```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

"A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router."

The app.js file that creates the actual application takes the router into use as shown below:

```js
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)
```

After making these changes, our app.js file looks like this:

```js
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

Note on exports

We have used two different kinds of exports in this part. Firstly, e.g. the file utils/logger.js does the export as follows:

```js
const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}


module.exports = {
  info, error
}

```
The functions can be used in `two different` ways. The first option is to require the whole object and refer to functions through the object using the dot notation:

```js
const logger = require('./utils/logger')

logger.info('message')

logger.error('error message')

```

The other option is to destructure the functions to their own variables in the require statement:

```js
const { info, error } = require('./utils/logger')

info('message')
error('error message')

```

The second way of exporting may be preferable if only a small portion of the exported functions are used in a file. E.g. in file controller/notes.js exporting happens as follows:
```js
const notesRouter = require('express').Router()
const Note = require('../models/note')

// ...


module.exports = notesRouter
```

In this case, there is just one "thing" exported, so the only way to use it is the following:

```js
const notesRouter = require('./controllers/notes')

// ...

app.use('/api/notes', notesRouter)
```

### Testing Node applications

* Let's define the npm script test for the test execution:

```js
{
  //...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",

    "test": "node --test"
  },
  //...
}
```

Let's put the tests for the average function, into a new file called tests/average.test.js.

```js
const { test, describe } = require('node:test')
const { test } = require('node:test')
const assert = require('node:assert')

const average = require('../utils/for_testing').average

describe('average', () => {
  test('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('of many is calculated right', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})
```
-If you want to test a specific file, you can use the following commant in the console: `node --test tests/dummy.test.js`



1. Array (Массивы)

*  _.chunk(array, size) — разбивает массив на подмассивы заданного размера.

```js
_.chunk([1, 2, 3, 4], 2); // => [[1, 2], [3, 4]]
```

* _.compact(array) — удаляет все ложные значения (false, null, 0, "", undefined, NaN).

```js
_.compact([0, 1, false, 2, '', 3]); // => [1, 2, 3]
```

* _.concat(array, ...values) — объединяет массив с другими значениями или массивами.

```js
_.concat([1], 2, [3], [[4]]); // => [1, 2, 3, [4]]
```

* _.difference(array, [values]) — возвращает массив элементов, которые отсутствуют в values.

   ```js
    _.difference([2, 1], [2, 3]); // => [1]
    ```

2. Collection (Коллекции)

* _.filter(collection, predicate) — возвращает новый массив, содержащий элементы, прошедшие проверку.

```js
_.filter([4, 5, 6], n => n % 2 == 0); // => [4, 6]
```

* _.map(collection, iteratee) — создает массив, в котором каждый элемент преобразован функцией iteratee.

```js
_.map([1, 2, 3], n => n * 3); // => [3, 6, 9]
```

* _.find(collection, predicate) — возвращает первый элемент, удовлетворяющий условию.

```js
_.find([1, 2, 3, 4], n => n % 2 === 0); // => 2
```

* _.sample(collection) — возвращает случайный элемент коллекции.

    ```js
    _.sample([1, 2, 3, 4]); // => случайное значение, например, 3
    ```

3. Object (Объекты)

* _.assign(object, [sources]) — копирует свойства из sources в object.

```js
_.assign({ 'a': 1 }, { 'b': 2 }, { 'c': 3 }); // => { 'a': 1, 'b': 2, 'c': 3 }
```

* _.get(object, path, [defaultValue]) — возвращает значение по указанному пути.

```js
const object = { 'a': [{ 'b': { 'c': 3 } }] };
_.get(object, 'a[0].b.c'); // => 3
```

* _.set(object, path, value) — задает значение по указанному пути.

```js
const object = { 'a': [{ 'b': { 'c': 3 } }] };
_.set(object, 'a[0].b.c', 4); // object => { 'a': [{ 'b': { 'c': 4 } }] }
```

* _.omit(object, [paths]) — создает новый объект без указанных ключей.

```js
 _.omit({ 'a': 1, 'b': 2, 'c': 3 }, ['a', 'c']); // => { 'b': 2 }
 ```

4. Lang (Типы данных)

* _.clone(value) — создает поверхностную копию значения.

```js
const objects = [{ 'a': 1 }];
const shallow = _.clone(objects);
shallow === objects; // => false
```

* _.isArray(value) — проверяет, является ли значение массивом.

```js
_.isArray([1, 2, 3]); // => true
_.isArray('abc'); // => false
```

* _.isEqual(value, other) — выполняет глубокое сравнение для проверки равенства значений.

    ```js
    const object = { 'a': 1 };
    const other = { 'a': 1 };
    _.isEqual(object, other); // => true
    ```

5. Math (Математика)

* _.add(augend, addend) — складывает два числа.

```js
_.add(6, 4); // => 10
```

* _.ceil(number, [precision]) — округляет число вверх.

```js
_.ceil(4.006); // => 5
_.ceil(4.006, 2); // => 4.01
```

* _.max(array) — возвращает максимальное значение массива.

    ```js
    _.max([4, 2, 8, 6]); // => 8
    ```

6. String (Строки)

* _.camelCase([string='']) — преобразует строку в верблюжий регистр.

```js
_.camelCase('Foo Bar'); // => 'fooBar'
```

* _.kebabCase([string='']) — преобразует строку в kebab-case.

```js
_.kebabCase('Foo Bar'); // => 'foo-bar'
```

* _.upperCase([string='']) — преобразует строку в верхний регистр.

    ```js
    _.upperCase('fooBar'); // => 'FOO BAR'
    ```

7. Function (Функции)

* _.debounce(func, [wait=0], [options={}]) — ограничивает частоту вызова функции.

```js
const log = _.debounce(() => console.log('Вызвано!'), 1000);
log(); // "Вызвано!" произойдет не чаще одного раза в секунду
```

* _.memoize(func, [resolver]) — кэширует результат функции.

    ```js
    const object = { 'a': 1, 'b': 2 };
    const values = _.memoize(Object.values);
    values(object); // Вычисляет первый раз
    values(object); // Берет результат из кэша
    ```

8. Utility (Утилиты)

* _.times(n, iteratee) — вызывает функцию n раз.

```js
_.times(3, String); // => ['0', '1', '2']
```

* _.range([start=0], end, [step=1]) — создает массив чисел от start до end, не включая end.

```js
_.range(4); // => [0, 1, 2, 3]
_.range(1, 5); // => [1, 2, 3, 4]
```
* _.uniqueId([prefix='']) — генерирует уникальный идентификатор с опциональным префиксом.

 ```js
    _.uniqueId('contact_'); // => 'contact_1'
    ```

### Пример работы с _.chain

* Метод _.chain позволяет вызывать функции Lodash "цепочкой" — одна за другой:

```javascript

const result = _.chain([1, 2, 3, 4])
.map(n => n * 2)   // Умножает каждый элемент на 2
.filter(n => n > 4) // Оставляет только значения больше 4
.value();          // Получаем конечный результат

console.log(result); // => [6, 8]
```

### Cписок основных модулей и функций, которые предоставляет Lodash:
1. Array (Массивы)

    _.chunk — разбивает массив на подмассивы определенной длины.
    _.compact — удаляет все ложные значения (например, null, 0, false) из массива.
    _.concat — объединяет массив с другими значениями или массивами.
    _.difference — возвращает массив с элементами, которых нет в другом массиве.
    _.drop / _.dropRight — удаляет несколько первых или последних элементов массива.
    _.fill — заменяет все элементы массива определенным значением.
    _.flatten / _.flattenDeep — "разворачивает" вложенные массивы на один или несколько уровней.
    _.head / _.last — возвращает первый или последний элемент массива.

2. Collection (Коллекции)

    _.countBy — группирует элементы коллекции по результатам функции и возвращает количество элементов в каждой группе.
    _.every — проверяет, соответствует ли каждый элемент коллекции заданному условию.
    _.filter — создает новый массив с элементами, прошедшими проверку условия.
    _.find — возвращает первый элемент, удовлетворяющий условию.
    _.groupBy — группирует элементы коллекции по значению, возвращенному функцией.
    _.map — создает новый массив, применяя функцию к каждому элементу коллекции.
    _.reduce — сворачивает коллекцию в одно значение, применяя функцию к каждому элементу.
    _.sample / _.sampleSize — возвращает случайный элемент или несколько случайных элементов из коллекции.

3. Date (Даты)

    Lodash не предоставляет обширного набора функций для работы с датами, но в ней есть методы, такие как _.now, возвращающий текущее время в миллисекундах.

4. Function (Функции)

    _.debounce — ограничивает частоту вызова функции, вызывая её только после паузы.
    _.throttle — контролирует частоту выполнения функции.
    _.memoize — кэширует результаты функции для оптимизации повторных вызовов с одинаковыми аргументами.
    _.once — позволяет функции выполняться только один раз.
    _.after / _.before — задает, сколько раз функция может выполняться до или после заданного количества вызовов.

5. Lang (Типы данных)

    _.clone / _.cloneDeep — создает поверхностную или глубокую копию значения.
    _.isArray, _.isObject, _.isString, _.isNumber и др. — проверка типа данных.
    _.isEqual — глубокое сравнение двух значений на равенство.
    _.toNumber, _.toString — преобразование значений в нужный тип.

6. Math (Математика)

    _.add, _.subtract, _.multiply, _.divide — арифметические операции.
    _.ceil, _.floor, _.round — округление чисел.
    _.max / _.min — возвращает максимальное или минимальное значение массива.
    _.sum / _.mean — возвращает сумму или среднее значение элементов массива.

7. Number (Числа)

    _.inRange — проверяет, находится ли число в заданном диапазоне.
    _.random — возвращает случайное число в диапазоне.

8. Object (Объекты)

    _.assign / _.merge — копирует свойства одного объекта в другой.
    _.get / _.set — получает или устанавливает значение по указанному пути.
    _.has — проверяет, есть ли свойство по указанному пути в объекте.
    _.invert — создает новый объект, в котором ключи и значения поменяны местами.
    _.keys, _.values, _.entries — возвращает массивы ключей, значений или пар [ключ, значение] объекта.
    _.omit, _.pick — создает новый объект, исключая или выбирая определенные ключи.

9. Seq (Последовательности)

    Lodash также поддерживает метод _.chain, который позволяет "цепочкой" вызывать несколько методов, что делает код более читаемым.
    Пример: _.chain(array).map().filter().value().

10. String (Строки)

    _.camelCase, _.kebabCase, _.snakeCase, _.upperCase, _.lowerCase — преобразует строку в нужный регистр.
    _.trim, _.trimStart, _.trimEnd — удаляет пробелы в начале и конце строки.
    _.pad, _.padStart, _.padEnd — добавляет символы в начало или конец строки для выравнивания.
    _.escape, _.unescape — экранирует или убирает экранирование для HTML.

11. Utility (Утилиты)

    _.times — вызывает функцию указанное количество раз.
    _.noop — пустая функция, которая ничего не делает.
    _.range — создает массив с диапазоном чисел.
    _.uniqueId — генерирует уникальный идентификатор.
    _.attempt — обрабатывает ошибки при вызове функции.



### Test environtment

The convention in Node is to define the execution mode of the application with the NODE_ENV environment variable. 
let's change the scripts in our notes application package.json file, so that when tests are run, NODE_ENV gets the value test:

```js
{
  // ...
  "scripts": {

    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "test": "NODE_ENV=test node --test",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
  },
  // ...
}
```

There is a slight issue in the way that we have specified the mode of the application in our scripts: it will not work on Windows. We can correct this by installing the cross-env package as a development dependency with the command:
`npm install --save-dev cross-env`


```js
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "test": "cross-env  NODE_ENV=test node --test",
    // ...
  },
  // ...
}
```

NB: If you are deploying this application to Fly.io/Render, keep in mind that if cross-env is saved as a development dependency, it would cause an application error on your web server. To fix this, change cross-env to a production dependency by running this in the command line:
`npm install cross-env`


SuperTest

We will install the package as a development dependency:
`npm install --save-dev supertest`
