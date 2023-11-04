import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import {store} from './state/store';

const root = ReactDOM.createRoot(
   document.getElementById('root') as HTMLElement
);

root.render(
   <Provider store={store}>
     <App/>
   </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// import axios from 'axios'
// import React, {useEffect} from 'react'
// import ReactDOM from 'react-dom/client';
// import {Provider, TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
// import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
// import thunk, {ThunkDispatch} from 'redux-thunk';
//
// // Types
// type CommentType = {
//   postId: string
//   id: string
//   name: string
//   email: string
//   body: string
// }
//
// // Api
// const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})
//
// const commentsAPI = {
//   getComments() {
//     return instance.get<CommentType[]>('comments')
//   }
// }
//
// // Reducer
// const initState = [] as CommentType[]
//
// type InitStateType = typeof initState
//
// const commentsReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
//   switch (action.type) {
//     case 'COMMENTS/GET-COMMENTS':
//       return action.comments
//     default:
//       return state
//   }
// }
//
// const getCommentsAC = (comments: CommentType[]) => ({type: 'COMMENTS/GET-COMMENTS', comments} as const)
// type ActionsType = ReturnType<typeof getCommentsAC>
//
// const getCommentsTC = () => (dispatch: DispatchType) => {
//   commentsAPI.getComments()
//      .then((res) => {
//        dispatch(getCommentsAC(res.data))
//      })
// }
//
//
// // Store
// const rootReducer = combineReducers({
//   comments: commentsReducer,
// })
//
// const store = createStore(rootReducer, applyMiddleware(thunk))
// type RootState = ReturnType<typeof rootReducer>
// type DispatchType = ThunkDispatch<RootState, unknown, ActionsType>
// const useAppDispatch = () => useDispatch<DispatchType>()
// const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
//
// // App
// export const App = () => {
//
//   const comments = useAppSelector(state => state.comments)
//   const dispatch = useAppDispatch()
//
//   useEffect(() => {
//     dispatch(getCommentsTC())
//   }, [])
//
//   return (
//      <>
//        <h1>📝 Список комментариев</h1>
//        {
//          comments.map(c => {
//            return <div key={c.id}><b>Comment</b>: {c.body} </div>
//          })
//        }
//      </>
//   )
// }
//
//
// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
// root.render(<Provider store={store}> <App/></Provider>)
//
// // 📜 Описание:
// // Ваша задача стоит в том чтобы правильно передать нужные типы в дженериковый тип ThunkDispatch<any, any, any>.
// // Что нужно написать вместо any, any, any чтобы правильно типизировать dispatch ?
// // Ответ дайте через пробел
//
// // 🖥 Пример ответа: unknown status isDone


/*
import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client';
import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux'
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {Provider, TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import axios from 'axios';

// Types
type PostType = {
  body: string
  id: string
  title: string
  userId: string
}

type PayloadType = {
  title: string
  body?: string
}


// Api
const instance = axios.create({baseURL: 'https://exams-frontend.kimitsu.it-incubator.ru/api/'})

const postsAPI = {
  getPosts() {
    return instance.get<PostType[]>('posts')
  },
  updatePostTitle(postId: string, post: PayloadType) {
    return instance.put<PostType>(`posts/${postId}`, post)
  }
}


// Reducer
const initState = [] as PostType[]

type InitStateType = typeof initState

const postsReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
  switch (action.type) {
    case 'POSTS/GET-POSTS':
      return action.posts

    case 'POSTS/UPDATE-POST-TITLE':
      return state.map((p) => {
        if (p.id === action.post.id) {
          return {...p, title: action.post.title}
        } else {
          return p
        }
      })

    default:
      return state
  }
}

const getPostsAC = (posts: PostType[]) => ({type: 'POSTS/GET-POSTS', posts} as const)
const updatePostTitleAC = (post: PostType) => ({type: 'POSTS/UPDATE-POST-TITLE', post} as const)
type ActionsType = ReturnType<typeof getPostsAC> | ReturnType<typeof updatePostTitleAC>

const getPostsTC = (): AppThunk => (dispatch) => {
  postsAPI.getPosts()
     .then((res) => {
       dispatch(getPostsAC(res.data))
     })
}

const updatePostTC = (postId: string): AppThunk => (dispatch, getState: () => RootState) => {
  try {
    const currentPost = getState().posts.find(post => post.id === postId)

    if (currentPost) {
      const payload = {title: 'Летим 🚀'};
      postsAPI.updatePostTitle(postId, payload)
         .then((res) => {
           dispatch(updatePostTitleAC(res.data))
         })
    }
  } catch (e) {
    alert('Обновить пост не удалось 😢')
  }

}

// Store
const rootReducer = combineReducers({
  posts: postsReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))
type RootState = ReturnType<typeof store.getState>
type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>
type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>
const useAppDispatch = () => useDispatch<AppDispatch>()
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// App
const App = () => {
  const dispatch = useAppDispatch()
  const posts = useAppSelector(state => state.posts)

  useEffect(() => {
    dispatch(getPostsTC())
  }, [])

  const updatePostHandler = (postId: string) => {
    dispatch(updatePostTC(postId))
  }

  return (
     <>
       <h1>📜 Список постов</h1>
       {
         posts.map(p => {
           return <div key={p.id}>
             <b>title</b>: {p.title}
             <button onClick={() => updatePostHandler(p.id)}>Обновить пост</button>
           </div>
         })
       }
     </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}> <App/></Provider>)

// 📜 Описание:
// Попробуйте обновить пост и вы увидите alert с ошибкой.
// Debugger / network / console.log вам в помощь
// Найдите ошибку и вставьте исправленную строку кода в качестве ответа.

// 🖥 Пример ответа: const payload = {...currentPost, tile: 'Летим 🚀'}*/
