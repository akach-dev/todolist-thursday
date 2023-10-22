// // import React from 'react';
// // import ReactDOM from 'react-dom/client';
// // import './index.css';
// // import reportWebVitals from './reportWebVitals';
// // import App from './App';
// // import {Provider} from 'react-redux';
// // import {store} from './state/store';
// //
// // const root = ReactDOM.createRoot(
// //     document.getElementById('root') as HTMLElement
// // );
// //
// // root.render(
// //     <Provider store={store}>
// //     <App />
// //     </Provider>
// // );
// //
// // // If you want to start measuring performance in your app, pass a function
// // // to log results (for example: reportWebVitals(console.log))
// // // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// // reportWebVitals();
//
// import axios from 'axios'
// import React, {useEffect, useState} from 'react'
// import ReactDOM from 'react-dom/client'
//
// type UserType = {
//   id: string;
//   name: string;
//   age: number;
// }
//
// // API
// const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})
//
// const api = {
//   getUsers(pageNumber: number) {
//     return instance.get(`users?pageSize=${3}&pageNumber${pageNumber}`)
//     return instance.get(`users?pageSize=${3}&pageNumber=${pageNumber}`)
//   },
// }
//
// // App
// const buttons = [
//   {id: 1, title: '1'},
//   {id: 2, title: '2'},
//   {id: 3, title: '3'},
// ]
//
// export const App = () => {
//
//   const [users, setUsers] = useState<UserType[]>([])
//   const [currentPage, setCurrentPage] = useState(1)
//
//   useEffect(() => {
//     api.getUsers(currentPage)
//        .then((res: any) => {
//          setUsers(res.data.items)
//        })
//   }, [currentPage])
//
//   const setPageHandler = (page: number) => {
//     setCurrentPage(page)
//   };
//
//   return (
//      <>
//        <h1>👪 Список пользователей</h1>
//        {
//          users.map(u => {
//            return <div style={{marginBottom: '25px'}} key={u.id}>
//              <p><b>name</b>: {u.name}</p>
//              <p><b>age</b>: {u.age}</p>
//            </div>
//          })
//        }
//
//        {
//          buttons.map(b => {
//            return (
//               <button key={b.id}
//                       style={b.id === currentPage ? {backgroundColor: 'lightblue'} : {}}
//                       onClick={() => setPageHandler(b.id)}>
//                 {b.title}
//               </button>
//            )
//          })
//        }
//      </>
//   )
// }
//
//
// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(<App/>)
//
// // 📜 Описание:
// // При переходе по страницам должны подгружаться новые пользователи.
// // Однако в коде допущена ошибка и всегда подгружаются одни и теже пользователи.
// // Задача: найти эту ошибку, и исправленную версию строки написать в качестве ответа.
//
// // 🖥 Пример ответа: const [currentPage, setCurrentPage] = useState(page)

//====================================================================================//


//====================================================================================//

// import axios from 'axios'
// import React, {useEffect, useState} from 'react'
// import ReactDOM from 'react-dom/client';
//
// // Types
// type PostType = {
//   body: string
//   id: string
//   title: string
//   userId: string
// }
//
//
// // Api
// const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})
//
// const postsAPI = {
//   getPosts() {
//     return instance.get<PostType[]>('posts')
//   },
//   deletePost(id: string) {
//     return instance.delete<{ message: string }>(`posts/${id}`)
//   }
// }
//
//
// // App
// export const App = () => {
//
//   const [posts, setPosts] = useState<PostType[]>([])
//
//   useEffect(() => {
//     postsAPI.getPosts()
//        .then((res) => {
//          setPosts(res.data)
//        })
//   }, [])
//
//   const deletePostHandler = (id: string) => {
//     postsAPI.deletePost(id)
//        .then((res) => {
//          const newPostsArr = posts.filter(p => p.id !== id)
//          setPosts(newPostsArr)
//        })
//   };
//
//   return (
//      <>
//        <h1>📜 Список постов</h1>
//        {posts.map(p => {
//          return (
//             <div key={p.id}>
//               <b>title</b>: {p.title}
//               <button style={{marginLeft: '15px'}}
//                       onClick={() => deletePostHandler(p.id)}>
//                 x
//               </button>
//             </div>
//          )
//        })}
//      </>
//   )
// }
//
//
// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(<App/>)
//
// // 📜 Описание:
// // Почему не удаляется post при нажатии на кнопку удаления (х) ?
// // Найдите ошибку и вставьте исправленную строку кода в качестве ответа
// //
// // 🖥 Пример ответа: return axios.delete
