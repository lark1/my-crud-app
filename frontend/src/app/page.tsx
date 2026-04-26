'use client';

import { Todo } from "@/types/todo";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TodoPage() {
  const fetch_url = process.env.NEXT_PUBLIC_API_URL;
  const [todos, setTodos ] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isSubmitting, setIsSubmitting ] = useState(false);

  const [ editingId, setEditingId ] = useState<number | null>(null);
  const [ editTitle, setEditTitle ] = useState("");

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

  // 編集開始処理
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  // 更新処理
  const updateTodo = async (id: number, data: { title?: string; is_completed?: boolean }) => {
    try { 
      const response = await fetch(`${fetch_url}/todos/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type":"application/json",
        },
        body: JSON.stringify(data),
      });
    
      setEditingId(null);
      fetchTodos();
    } catch (error) {
      console.error("更新エラー",error);
    }
  }

  // createTodo
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      toast.error("タスクを入力してください");
      return;
    };
    
    setIsSubmitting(true);

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
        toast.success("タスクを追加しました");
      } else {
        toast.error("追加に失敗しました")
      }
    } catch(error) {
      toast.error("通信エラーが発生しました")
    } finally {
      setIsSubmitting(false);
    }
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
    <Toaster position="bottom-right"/>
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-600">
          Todo App
        </h1>

          {/* 入力エリア */}
        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <Input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="タスクを入力"
           />
          <Button
          type="submit"
          disabled={isSubmitting}
          className={"bg-blue-600 hover:bg-blue-700 text-white"}>
            {isSubmitting ? "追加中…" : "追加"}
          </Button>
        </form>

        {/* リスト表示エリア */}
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
            key={todo.id}
            className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* チェックボックス */}
                <Input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => updateTodo(todo.id,{ title: todo.title,is_completed: !todo.is_completed})}
                className="w-5 h-5 cursor-pointer accent-blue-600 rounded" 
                />

                {editingId === todo.id ? (
                  <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => updateTodo(todo.id, {title: editTitle, is_completed: todo.is_completed})}
                  onKeyDown={(e) => e.key === 'Enter' && updateTodo(todo.id, {title: editTitle,is_completed: todo.is_completed})}
                  autoFocus
                  
                  />
                ) : (
               
                <span onClick={() => startEdit(todo)}
                className="cursor-pointer text-lg">
                  {todo.title}
                </span>
                )}
              </div>
              
              {/* 削除ボタン */}
              <Button
              onClick={() => deleteTodo(todo.id)}
              variant="ghost"
              size="icon"
              
              title="削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
};
