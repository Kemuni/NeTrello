"use client"; // Убедитесь, что компонент является клиентским

import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  IssueList,
  Issue,
  useCreateNewIssueList,
  useFetchIssueBoards,
  useFetchProjectIssues,
} from "../../../services/gitlab";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // Добавляем useParams
import UserProfile from "../../../components/UserProfile";
import Cheburator from "../../../components/Сheburator";

interface IssueListProps extends IssueList {
  issues?: Issue[];
}

const Card: React.FC<{ issue: Issue }> = ({ issue }) => {
  const router = useRouter();
  const params = useParams(); // Получаем параметры маршрута

  // Обработчик клика для перехода на страницу /boards/[id]/issues
  const handleCardClick = () => {
    if (!params.id) {
      console.error("ID is undefined");
      return;
    }

    // Кодируем данные о issue перед передачей через URL
    const encodedIssue = encodeURIComponent(JSON.stringify(issue));
    router.push(`/boards/${params.id}/issues?issue=${encodedIssue}`);
  };

  return (
    <div
      key={issue.id}
      className="flex justify-center items-center w-full relative cursor-pointer"
      onClick={handleCardClick} // Добавляем обработчик клика
    >
      <img src="/packet.png" alt="packett" className="w-[60%]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[70%] w-[50%] max-w-[400px] text-center bg-gray-300 rounded-lg shadow-md">
        <p className="my-2">Название: {issue.title}</p>
        <p>Автор: {issue.author.name}</p>
        <p>Метки: {issue.labels.join(", ")}</p>
      </div>
    </div>
  );
};

const ListComponent: React.FC<{ title: string, issues: Issue[] }> = ({ title, issues }) => {
  return (
    <div className="bg-[rgba(124,124,124,0.5)] w-[30%] h-full rounded-2xl border-4 border-gray-300 flex flex-col items-center pt-5 flex-shrink-0 overflow-y-auto no-scrollbar">
      <h2 className="text-5xl text-white">{title}</h2>
      {
        issues !== undefined
          ? issues.map((i) =>
            <Card issue={i}/>
          )
          : null
      }
    </div>
  );
};



const AddList: React.FC<{ onCancel: () => void; onAdd: (title: string) => void }> = ({ onCancel, onAdd }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="bg-[rgba(124,124,124,0.5)] w-[30%] h-[100%] rounded-2xl border-4 border-gray-300 flex flex-col items-center justify-between pt-5 flex-shrink-0">
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-white">Новая страница</h2>
        <div className="flex flex-col mt-4">
          <input
            type="text"
            placeholder="Введите название"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full py-2 px-5 border border-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white text-white bg-[rgba(124,124,124,0.5)]"
          />
        </div>
      </div>
      <div className="flex flex-row text-white place-content-around w-full pb-5 text-xl">
        <button
          className="w-[120px] py-1.5 border border-white rounded-md bg-gray-400 justify-center"
          onClick={handleAdd}
        >
          Добавить
        </button>
        <button
          className="w-[120px] py-1.5 border border-white rounded-md bg-gray-400 justify-center"
          onClick={onCancel}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

const Board: React.FC = ({params,}: { params: { id: number }}) => {
  const { id } = params;
  if (!(id)) {
    redirect('/boards')
  }

  let initialLists: IssueListProps[] = [];
  const [openedListIssues, setOpenedListIssues] = useState<Issue[]>([]);
  const [closedListIssues, setClosedListIssues] = useState<Issue[]>([]);
  const [lists, setLists] = useState<IssueListProps[]>(initialLists);
  const [showAddList, setShowAddList] = useState(false);
  const [boardId, setBoardId] = useState<null | number>(null);

  const { data: session, status } = useSession();

  // @ts-ignore
  const { issueBoards, isLoading:  isBoardsLoading, fetchIssueBoards} = useFetchIssueBoards();
  const { createNewIssueList } = useCreateNewIssueList();
  const { issues, isLoading: isIssuesLoading, fetchIssues } = useFetchProjectIssues();

  useEffect(() => {
    // @ts-ignore
    if (status === "unauthenticated" || (status === "authenticated" && session?.accessToken === undefined)) redirect('/');
    if (status === "authenticated") {
      // @ts-ignore
      fetchIssueBoards(session?.accessToken, id);
      // @ts-ignore
      fetchIssues(session?.accessToken, id);
    }
  }, [status]);

  useEffect(() => {
    if (issueBoards.length === 0) return;
    const board = issueBoards[0];
    initialLists = board.lists;
    initialLists.sort((a, b) => a.position - b.position);
    setLists(initialLists);
    setBoardId(board.id);
  }, [isBoardsLoading]);

  useEffect(() => {
    if (isBoardsLoading || isIssuesLoading || lists.length === 0) return;

    for (const issue of issues) {
      if (issue.state === "opened") setOpenedListIssues([...openedListIssues, issue]);
      else setClosedListIssues([...closedListIssues, issue]);

      for (const list of lists) {
        if (issue.labels.some((i) => i === list.label.name)) {
          list.issues === undefined ? list.issues = [issue] : list.issues.push(issue);
          setLists([...lists])
        }
      }
    }

  }, [isBoardsLoading, isIssuesLoading]);

  if (isBoardsLoading) return <h1>Загрузка досок...</h1>;
  if (status === "loading" ) return <h1>Загрузка...</h1>;

  const handleAddList = (title: string) => {
    const newList: IssueList = {
      id: title.length + 1,
      label: {name:title, color: "#FFF"},
      position: 1,
    };
    // @ts-ignore
    createNewIssueList(session?.accessToken, id, boardId, title)
    setLists([...lists, newList]);
    setShowAddList(false);
  };

  return (
    <div className="monomakh-regular relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
      <Link href={"/boards"} className="absolute top-[10px] left-[10px] w-20 h-20 bg-red-500 text-white border-none rounded-full cursor-pointer">
        <img src="/arrow-left.png" alt="arrow-left" className="w-full h-[80%]" />
      </Link>п
      <UserProfile />

      <div className="flex w-[80%] h-[80%] gap-4 overflow-x-auto">
        <ListComponent title="Открытые" issues={openedListIssues}/>

        {lists.map((list) => (
          <ListComponent key={list.id} title={list.label.name} issues={list.issues}/>
        ))}

        <ListComponent title="Закрытые" issues={closedListIssues}/>

        {showAddList ? (
          <AddList
            onCancel={() => setShowAddList(false)}
            onAdd={handleAddList}
          />
        ) : (
          <div
            className="bg-[rgba(124,124,124,0.5)] w-[30%] h-[15%] rounded-2xl border-4 border-gray-300 flex flex-col items-center pt-5 cursor-pointer flex-shrink-0"
            onClick={() => setShowAddList(true)}
          >
            <h2 className="text-4xl text-white">Добавить страницу</h2>
          </div>
        )}
      </div>
      <Cheburator />
    </div>
  );
};

export default Board;
