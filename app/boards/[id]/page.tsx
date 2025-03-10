import {redirect} from "next/navigation";


export default async function Board({params,}: { params: Promise<{ id: number }>})
{
  const { id } = await params;
  if (!(id)) {
    redirect('/boards')
  }

  return (
    <h1>Hi! {id}</h1>
  );
}
