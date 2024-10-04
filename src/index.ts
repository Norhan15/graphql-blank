import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

let books: any = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
    stock: 2,
    price: 250,
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
    stock: 13,
    price: 250,
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "Paul Auster",
    stock: 23,
    price: 250,
  },
];
const authors = [
  {
    id: 1,
    name: "Oscar",
    age: 20,
  },
  {
    id: 2,
    name: "Oscar",
    age: 20,
  },
  {
    id: 3,
    name: "Oscar",
    age: 20,
  },
];


const typeDefs = `
type Book{
    id: ID,
    title: String,
    author: String,
    stock: Int,
    price: Float,
}
type Author{
    id: ID,
    name: String,
    age: Int,
}
type Query {
    books: [Book]
    authors:[Author]
    book(id:ID): Book!
}

input BookInput {
  id: Int
  title: String,
  author: String
  stock: Int,
  price: Float,
}

type Mutation {
  createBook(book:BookInput):Book,
  updateBook(book:BookInput):Book,
  deleteBook(book:BookInput):Book
}
`;

const resolvers = {
  Query: {
    books: () => books,
    book: (_parenst: any, args: any) => {
      const bookId = args.id;
      for (let book of books) {
        if (book.id == bookId) return book;
      }
    },
    authors: () => authors,
  },
  Mutation: {
    createBook: (_: void, args: any) => {
      const bookInput = args.book;
      const book = {
        id: books.length + 1,
        title: bookInput.title,
        author: bookInput.author,
        stock: bookInput.stock,
        price: bookInput.price
      }
      books.push(book)
      return book;
    },
    updateBook: (_: void, args: any) => {
      const bookInput = args.book
      books.map((books: {id: Number, title: String, author: String, stock: Number, price: Number}) => {
        if (bookInput.id == books.id) {
          books.title = bookInput.title
          books.author = bookInput.author
          books.stock = bookInput.stock
          books.price = bookInput.price
        }
      })
      return bookInput;
    },
    deleteBook: (_: void, args: any) => {
      const data = args.book;
      const id = data.id;
      books = books.filter((book: { id: Number; }) => book.id !== id)
      console.log("Libro eliminado exitosamente: ID: " + id)
      return books;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
  });
  console.log("servidor corriendo en " + url);
})();
console.log("OK!");