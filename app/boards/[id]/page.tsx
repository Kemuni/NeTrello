"use client";

import React, { useEffect, useState, useCallback } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  IssueList,
  Issue,
  useCreateNewIssueList,
  useFetchIssueBoards,
  useFetchProjectIssues, useDeleteIssueList,
} from "../../../services/gitlab";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import UserProfile from "../../../components/UserProfile";
import Cheburator from "../../../components/Сheburator";

interface IssueListProps extends IssueList {
  issues?: Issue[];
}

const Card: React.FC<{ issue: Issue }> = ({ issue }) => {
  const router = useRouter();
  const params = useParams();

  const handleCardClick = () => {
    if (!params.id) return;
    const encodedIssue = encodeURIComponent(JSON.stringify(issue));
    router.push(`/boards/${params.id}/issues?issue=${encodedIssue}`);
  };

  return (
    <div
      key={issue.id}
      className="flex justify-center items-center w-full relative cursor-pointer"
      onClick={handleCardClick}
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

const ListComponent: React.FC<{
  title: string;
  issues: Issue[];
  onDelete?: () => void;
}> = ({ title, issues, onDelete }) => {
  return (
    <div className="bg-[rgba(124,124,124,0.5)] w-[30%] h-full rounded-2xl border-4 border-gray-300 flex flex-col items-center pt-5 flex-shrink-0 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-2">
        <h2 className="text-5xl text-white">{title}</h2>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 bg-white rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold hover:cursor-pointer"
            title="Удалить столбец"
          >
            ×
          </button>
        )}
      </div>
      {issues?.map((i) => <Card key={i.id} issue={i} />)}
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
          className="w-[120px] py-1.5 border border-white rounded-md bg-gray-400 justify-center hover:cursor-pointer hover:bg-gray-500"
          onClick={handleAdd}
        >
          Добавить
        </button>
        <button
          className="w-[120px] py-1.5 border border-white rounded-md bg-gray-400 justify-center hover:cursor-pointer hover:bg-gray-500"
          onClick={onCancel}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

const Board: React.FC<{ params: { id: number } }> = ({ params }) => {
  const { id } = params;
  if (!id) redirect('/boards');

  const { data: session, status } = useSession();
  const { issueBoards, isLoading: isBoardsLoading, fetchIssueBoards } = useFetchIssueBoards();
  const { createNewIssueList } = useCreateNewIssueList();
  const { issues, isLoading: isIssuesLoading, fetchIssues } = useFetchProjectIssues();
  const { deleteIssueList } = useDeleteIssueList();

  const [lists, setLists] = useState<IssueListProps[]>([]);
  const [openedIssues, setOpenedIssues] = useState<Issue[]>([]);
  const [closedIssues, setClosedIssues] = useState<Issue[]>([]);
  const [showAddList, setShowAddList] = useState(false);
  const [boardId, setBoardId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    // @ts-ignore
    if (status !== "authenticated" || !session?.accessToken) return;

    // @ts-ignore
    await fetchIssueBoards(session.accessToken, id);
    // @ts-ignore
    await fetchIssues(session.accessToken, id);
    // @ts-ignore
  }, [status, session?.accessToken, id]);

  const handleDeleteList = async (listId: number, labelName: string) => {
    // @ts-ignore
    if (!session?.accessToken || !boardId) return;

    try {
      // @ts-ignore
      await deleteIssueList(session.accessToken, id, boardId, listId, labelName);
      loadData();
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  useEffect(() => {
    // @ts-ignore
    if (status === "unauthenticated" || (status === "authenticated" && !session?.accessToken)) {
      redirect('/');
    }
    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  useEffect(() => {
    if (isBoardsLoading || !issueBoards.length) return;

    const board = issueBoards[0];
    const sortedLists = [...board.lists].sort((a, b) => a.position - b.position);
    setLists(sortedLists);
    setBoardId(board.id);
  }, [isBoardsLoading, issueBoards]);

  useEffect(() => {
    if (isBoardsLoading || isIssuesLoading || !issues.length) return;

    const opened: Issue[] = [];
    const closed: Issue[] = [];
    const updatedLists = [...lists];

    issues.forEach(issue => {
      if (issue.state === "opened") opened.push(issue);
      else closed.push(issue);

      updatedLists.forEach(list => {
        if (issue.labels.includes(list.label.name)) {
          list.issues = list.issues ? [...list.issues, issue] : [issue];
        }
      });
    });

    setOpenedIssues(opened);
    setClosedIssues(closed);
    setLists(updatedLists);
  }, [isBoardsLoading, isIssuesLoading, issues]);

  const handleAddList = async (title: string) => {
    // @ts-ignore
    if (!session?.accessToken || !boardId) return;

    // @ts-ignore
    await createNewIssueList(session.accessToken, id, boardId, title);
    loadData();
    setShowAddList(false);
  };

  if (isBoardsLoading || status === "loading") return (
    <div className="monomakh-regular relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
      <h1>Загрузка...</h1>
    </div>
  );

  return (
    <div className="monomakh-regular relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
      <Link href="/boards" className="absolute top-[10px] left-[10px] w-18 h-18 bg-red-500 text-white border-none rounded-full cursor-pointer">
        <img src="/arrow-left.png" alt="arrow-left" className="w-full h-[94%]" />
      </Link>
      <UserProfile />

      <div className="flex w-[80%] h-[80%] gap-4 overflow-x-auto">
        <ListComponent title="Открытые" issues={openedIssues} />
        <ListComponent title="Закрытые" issues={closedIssues} />

        {lists.map((list) => (
          <ListComponent
            key={list.id}
            title={list.label.name}
            issues={list.issues || []}
            onDelete={() => handleDeleteList(list.id, list.label.name)}
          />
        ))}

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