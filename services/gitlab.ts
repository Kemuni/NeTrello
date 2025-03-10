import axios from "axios";
import {useEffect, useState} from "react";


const axiosInstance = axios.create({
  baseURL: "https://gitlab.com",
});



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
