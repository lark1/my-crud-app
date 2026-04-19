'use client';

import { Todo } from "@/types/todo";
import React, { useState, useEffect } from "react";

export default function TodoPage() {
  const fetch_url = process.env.NEXT_PUBLIC_API_URL;
  const [todos, setTodos ] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // 環境変数が設定されていない場合
  if (!fetch_url) {
    throw new Error("環境変数 NEXT_PUBLIC_API_URLが設定されていません");
  }

  const fetchTodos = async () => {
    try{
      const response = await fetch(`${fetch_url}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch(error) {
      console.error("通信エラー",error);
    }
  }

  // 画面が表示されたときに1度だけ更新
  useEffect(() => {
    fetchTodos();
  },[]);

  // createTodo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch(`${fetch_url}/todos`,{
        method: "POST",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify({title:newTodoTitle,is_completed: false}),
      });

      if (response.ok) {
        setNewTodoTitle("");
        fetchTodos();
      } else {
        const errorDetail = await response.json();
        console.error("サーバーエラー詳細：",errorDetail);
      }
      
  
    } catch(error) {
      console.error("ネットワーク接続エラー",error);
    }
  };
  
  // update
  const toggleTodo = async (id: number) => {
    await fetch(`${fetch_url}/todos/${id}`,{
      method: "PUT"
    });
    fetchTodos();
  };
//delete
  const deleteTodo = async (id: number) => {
    await fetch(`${fetch_url}/todos/${id}`,{
      method: "DELETE"
    });
    fetchTodos();
  }
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 text-slate-900">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-600">
          Todo App
        </h1>

          {/* 入力エリア */}
        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="タスクを入力"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
          >追加</button>
        </form>

        {/* リスト表示エリア */}
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
            key={todo.id}
            className="p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* チェックボックス */}
                <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 cursor-pointer accent-blue-600 rounded" 
                />
                {/* 完了時に打消し線を引くスタイリング */}
                <span className={`text-lg transition-all ${
                  todo.is_completed ? "line-through text-slate-400" :"text-slate-700"
                }`}>
                  {todo.title}
                </span>
              </div>
              
              {/* 削除ボタン */}
              <button
              onClick={() => deleteTodo(todo.id)}
              className="text-slate-300 hover:text-red-500 transition-colors p-1"
              title="削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
};
