import axios from "axios";
import {useCallback, useEffect, useState} from "react";


const axiosInstance = axios.create({
  baseURL: "https://gitlab.com",
});



interface RepositoryLinks {
  self: string
  issues: string
  labels: string
  members: string
}


interface RepositoryItem {
  id: number
  description: string | null
  name: string | null
  htto_url_to_repo: string | null
  web_url: string | null
  avatar_url: string | null
  archived: boolean
  visibility: "private" | "public"
  issues_enabled: boolean
  open_issues_count: number
  created_at: string
  last_activity_at: string
  forks_count: number
  star_count: number
  _links: RepositoryLinks
}


interface Label {
  name: string
  color: string
}

export interface IssueList {
  id: number
  label: Label
  position: number
}


interface IssueBoard {
  id: number
  name: string
  lists: IssueList[]
}


interface GitLabAuthor {
  state: string
  web_url: string
  avatar_url: string | null
  username: string
  id: number
  name: string
}


export interface Issue {
  id: number
  project_id: number
  author: GitLabAuthor
  description: string
  state: "opened" | "closed"
  labels: string[]
  title: string
  due_date: string | null
  created_at: string
  closed_at: string | null
  closed_by: GitLabAuthor
}


export const useFetchUserRepositories = (accessToken: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [repos, setRepos] = useState<RepositoryItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await axiosInstance
        .get<RepositoryItem[]>(
          "/api/v4/projects?membership=true",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            timeout: 20000
          }
        )
        .then(({ data }) => {
          setIsLoading(false);
          setRepos(data);
        })
        .catch((e) => {
          setIsLoading(false);
          setError(e.toString());
          console.log(e);
        });
    }

    fetchData();
  }, []);

  return { repos, isLoading, error}
}


export const useFetchIssueBoards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [issueBoards, setIssueBoards] = useState<IssueBoard[]>([]);

  const fetchIssueBoards = useCallback(async (accessToken: string, projectId: number) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get<IssueBoard[]>(
        `/api/v4/projects/${projectId}/boards`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          timeout: 20000
        }
      );
      setIssueBoards(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { issueBoards, isLoading, fetchIssueBoards };
};


export const useCreateNewIssueList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createNewLabel = async (accessToken: string, projectId: number, title: string): Promise<number> => {
    try {
      const { data } = await axiosInstance.post(
        `/api/v4/projects/${projectId}/labels`,
        { name: title, color: "#FFFFFF" },
        { headers: { "Authorization": `Bearer ${accessToken}` } }
      );
      return data.id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const createNewIssueList = useCallback(async (accessToken: string, projectId: number, boardId: number, title: string) => {
    setIsLoading(true);
    try {
      const labelId = await createNewLabel(accessToken, projectId, title);
      await axiosInstance.post(
        `/api/v4/projects/${projectId}/boards/${boardId}/lists?label_id=${labelId}`,
        {},
        { headers: { "Authorization": `Bearer ${accessToken}` } }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createNewIssueList, isLoading };
};

export const useFetchProjectIssues = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);

  const fetchIssues = useCallback(async (accessToken: string, projectId: number) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get<Issue[]>(
        `/api/v4/projects/${projectId}/issues`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          timeout: 20000
        }
      );
      setIssues(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { issues, isLoading, fetchIssues };
};

export const useDeleteIssueList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteLabel = async (accessToken: string, projectId: number, labelName: string) => {
    try {
      await axiosInstance.delete(
        `/api/v4/projects/${projectId}/labels`,
        {
          params: { name: labelName },
          headers: { "Authorization": `Bearer ${accessToken}` }
        }
      );
    } catch (e) {
      console.error("Failed to delete label:", e);
      throw e;
    }
  };

  const deleteIssueList = useCallback(async (
    accessToken: string,
    projectId: number,
    boardId: number,
    listId: number,
    labelName: string
  ) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(
        `/api/v4/projects/${projectId}/boards/${boardId}/lists/${listId}`,
        { headers: { "Authorization": `Bearer ${accessToken}` } }
      );

      await deleteLabel(accessToken, projectId, labelName);
    } catch (e) {
      console.error("Failed to delete issue list:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteIssueList, isLoading };
};


export const deleteGitLabIssue = async (accessToken: string, projectId: string | number, issueId: number) => {
  try {
    await axiosInstance.delete(
      `/api/v4/projects/${projectId}/issues/${issueId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return true;
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
};


export const useUpdateIssue = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateIssue = useCallback(async (
    accessToken: string,
    projectId: number,
    issueId: number,
    updateData: {
      title?: string;
      description?: string;
      due_date?: string;
      assignee_ids?: number[];
      labels?: string[];
    }
  ) => {
    setIsLoading(true);
    try {
      await axiosInstance.put(
        `/api/v4/projects/${projectId}/issues/${issueId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error updating issue:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateIssue, isLoading };
};
