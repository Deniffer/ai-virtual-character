import { QueryResult, QueryResultRow } from "pg";

import { VirtualCharacter } from "@/types/virtualCharacter";
import { getDb } from "./db";

export async function insertvirtualCharacter(
  virtualCharacter: VirtualCharacter
) {
  const db = getDb();
  const res = await db.query(
    `INSERT INTO virtualCharacters 
        (user_email, img_description, img_size, img_url, llm_name, llm_params, created_at) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
    `,
    [
      virtualCharacter.user_email,
      virtualCharacter.img_description,
      virtualCharacter.img_size,
      virtualCharacter.img_url,
      virtualCharacter.llm_name,
      virtualCharacter.llm_params,
      virtualCharacter.created_at,
    ]
  );

  return res;
}

export async function getVirtualCharactersCount(): Promise<number> {
  const db = getDb();
  const res = await db.query(`SELECT count(1) as count FROM virtualCharacters`);
  if (res.rowCount === 0) {
    return 0;
  }

  const { rows } = res;
  const row = rows[0];

  return row.count;
}

export async function getUserVirtualCharactersCount(
  user_email: string
): Promise<number> {
  const db = getDb();
  const res = await db.query(
    `SELECT count(1) as count FROM virtualCharacters WHERE user_email = $1`,
    [user_email]
  );
  if (res.rowCount === 0) {
    return 0;
  }

  const { rows } = res;
  const row = rows[0];

  return row.count;
}

export async function getVirtualCharacters(
  page: number,
  limit: number
): Promise<VirtualCharacter[] | undefined> {
  if (page < 1) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 50;
  }
  const offset = (page - 1) * limit;

  const db = getDb();
  const res = await db.query(
    `select w.*, u.email as user_email, u.nickname as user_name, u.avatar_url as user_avatar from virtualCharacters as w left join users as u on w.user_email = u.email order by w.created_at desc limit $1 offset $2`,
    [limit, offset]
  );
  if (res.rowCount === 0) {
    return undefined;
  }

  const virtualCharacters = getVirtualCharactersFromSqlResult(res);

  return virtualCharacters;
}

export function getVirtualCharactersFromSqlResult(
  res: QueryResult<QueryResultRow>
): VirtualCharacter[] {
  if (!res.rowCount || res.rowCount === 0) {
    return [];
  }

  const virtualCharacters: VirtualCharacter[] = [];
  const { rows } = res;
  rows.forEach((row) => {
    const virtualCharacter = formatVirtualCharacter(row);
    if (virtualCharacter) {
      virtualCharacters.push(virtualCharacter);
    }
  });

  return virtualCharacters;
}

export function formatVirtualCharacter(
  row: QueryResultRow
): VirtualCharacter | undefined {
  let virtualCharacter: VirtualCharacter = {
    id: row.id,
    user_email: row.user_email,
    img_description: row.img_description,
    img_size: row.img_size,
    img_url: row.img_url,
    llm_name: row.llm_name,
    llm_params: row.llm_params,
    created_at: row.created_at,
  };

  if (row.user_name || row.user_avatar) {
    virtualCharacter.created_user = {
      email: row.user_email,
      nickname: row.user_name,
      avatar_url: row.user_avatar,
    };
  }

  try {
    virtualCharacter.llm_params = JSON.parse(
      JSON.stringify(virtualCharacter.llm_params)
    );
  } catch (e) {
    console.log("parse virtualCharacter llm_params failed: ", e);
  }

  return virtualCharacter;
}
