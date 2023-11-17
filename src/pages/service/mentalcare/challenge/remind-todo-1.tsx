import TabLayout from "@/components/drawing/TabLayout"
import { Challenge, userAtom } from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MentalCareHeader } from "@/mentalcare/components/header";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { atomWithStorage } from "jotai/utils";


type Todo = {
  name: string;
  done: boolean;
}

export const DEFAULT_TODOs: Todo[] = [];

export const todosAtom = atomWithStorage<Todo[]>('todos', DEFAULT_TODOs)

export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

const IndexPage = ({locale}: { locale: string; }) => {

  const router = useRouter();
  const [user] = useAtom(userAtom)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [todos, setTodos] = useAtom(todosAtom)
  const [todo, setTodo] = useState<Todo>({ name: '', done: false })

  const handleList = () => {
    router.push('/service/mentalcare')
  }
  const handleChallenge = () => {

  }

  const handleAdd = () => {
    setTodos([...todos, todo])
    setTodo({
      name: '',
      done: false
    })
  }

  const handleRemove = (name: string) => () => {
    const newTodos = todos.filter(t => t.name !== name)
    setTodos(newTodos)
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
  }

  useEffect(() => {
    const { id } = { id: 'remind-todo-1' }
    const challenge = user.profile?.routines?.flatMap(routine => routine.challenges)
      .find(ch => ch.id === id)!
    setChallenge(challenge)

    if (user.profile?.routines?.length === 0) {
      router.push("/service/mentalcare/first")
      return
    }
  }, [user.profile]);

  return challenge && <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><button onClick={handleList}>List</button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><button onClick={handleChallenge}>History</button></div>
        </>
      } >
        <>
          <div className={'w-full h-full p-4'}>
            <MentalCareHeader locale={locale} />
            <div>
              <span className={"text-xl justify-end"}>{challenge.name}</span>
            </div>
            <main>
              <br/>
              {challenge.description}
              <br/>
              <br/>
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
            </main>
          </div>
        </>
      </TabLayout>
    </div>
  </>
}

export default IndexPage