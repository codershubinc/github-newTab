import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Square, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export default function FocusBoard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('focus-todos');
        if (saved) setTodos(JSON.parse(saved));
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('focus-todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setTodos([{ id: Date.now(), text: inputValue, completed: false }, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="w-full bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Focus Board
            </h3>

            <form onSubmit={addTodo} className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What is your main focus?"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-sm text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-600"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">
                    <Plus size={16} />
                </button>
            </form>

            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence>
                    {todos.length === 0 && (
                        <p className="text-xs text-zinc-600 text-center py-4 italic">No tasks yet. Stay focused.</p>
                    )}
                    {todos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${todo.completed ? 'bg-zinc-900/20 border-transparent opacity-50' : 'bg-zinc-800/30 border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            <button onClick={() => toggleTodo(todo.id)} className="text-zinc-500 hover:text-emerald-500 transition-colors">
                                {todo.completed ? <CheckSquare size={18} className="text-emerald-500" /> : <Square size={18} />}
                            </button>

                            <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                                {todo.text}
                            </span>

                            <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-400 transition-all">
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}