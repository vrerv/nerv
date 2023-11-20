import { useAtom } from "jotai";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { atomWithStorage } from "jotai/utils";


type Todo = {
  name: string;
  done: boolean;
}

export const DEFAULT_TODOs: Todo[] = [];

export const todosAtom = atomWithStorage<Todo[]>('todos', DEFAULT_TODOs)

export const TodoList = ({record}: {record: (value: string) => () => void;}) => {

  const [todos, setTodos] = useAtom(todosAtom)
  const [todo, setTodo] = useState<Todo>({ name: '', done: false })

  const handleAdd = () => {
    const newTodos = [...todos, todo]
    setTodos(newTodos)
    record(JSON.stringify(newTodos))();
    setTodo({
      name: '',
      done: false
    })
  }

  const handleRemove = (name: string) => () => {
    const newTodos = todos.filter(t => t.name !== name)
    setTodos(newTodos)
    record(JSON.stringify(newTodos))();
  }

  const handleTodoChange = (event:any) => {
    setTodo({
      ...todo,
      name: event.target.value
    })
  }

  const handleDone = (name: string) => () => {

    const newTodos = todos.map(t => {
      if  (t.name === name) {
        t.done = !t.done
      }
      return t
    })
    setTodos(newTodos)
    record(JSON.stringify(newTodos))();
  }

  return <>
    <Input className={'m-2'} type={'text'} value={todo.name} onChange={handleTodoChange} placeholder={'Todo'} />
    <Button className={'m-2'} variant={'outline'} onClick={handleAdd} >Add</Button>
    <br/>
    {todos.map((t) => <div key={t.name} className={'m-2 flex justify-between'}>
      <div className={'flex items-center space-x-2'}>
        <Checkbox id={t.name} onCheckedChange={handleDone(t.name)} />
        <Label htmlFor={t.name} className={'leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ' + (t.done ? 'line-through' : '')}>{t.name}</Label>
      </div>
      <Button className={'h-6'} variant={'outline'} size={'sm'} onClick={handleRemove(t.name)} >Remove</Button>
    </div>)}
  </>
}
